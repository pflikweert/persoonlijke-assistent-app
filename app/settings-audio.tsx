import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type GestureResponderEvent,
} from "react-native";

import { FullscreenMenuOverlay } from "@/components/navigation/fullscreen-menu-overlay";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ChoiceInputGroup } from "@/components/ui/radio-choice-group";
import {
  PrimaryButton,
  StateBlock,
  SurfaceSection,
} from "@/components/ui/screen-primitives";
import {
  SettingsStateBody,
  SettingsStateIcon,
} from "@/components/ui/settings-screen-primitives";
import { SettingsScaffold } from "@/components/ui/screen-scaffolds";
import {
  classifyUnknownError,
  fetchUserAudioPreferences,
  updateUserAudioPreferences,
} from "@/services";
import {
  ensureWebAudioInputPreferencesApplied,
  getWebAudioInputPreferences,
  listWebAudioInputDevices,
  primeWebAudioInputPermission,
  updateWebAudioInputPreferences,
  type WebAudioInputDevice,
} from "@/services/web-audio-input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colorTokens, spacing } from "@/theme";

const INPUT_GAIN_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
const CLIP_ZONE_START = 0.82;
const TEST_ANALYSIS_WINDOW_MS = 8000;
const TEST_ADVICE_REFRESH_MS = 2200;
const TEST_INITIAL_ADVICE_DELAY_MS = 5500;
const TEST_MIN_SPEECH_DURATION_MS = 2400;
const TEST_SPEECH_GATE = 0.12;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function closestGainStep(value: number): (typeof INPUT_GAIN_STEPS)[number] {
  return INPUT_GAIN_STEPS.reduce((closest, candidate) =>
    Math.abs(candidate - value) < Math.abs(closest - value) ? candidate : closest,
  );
}

function shiftGainStep(
  currentGain: number,
  direction: "up" | "down",
): (typeof INPUT_GAIN_STEPS)[number] {
  const current = closestGainStep(currentGain);
  const index = INPUT_GAIN_STEPS.indexOf(current);
  if (index < 0) {
    return current;
  }

  if (direction === "down") {
    return INPUT_GAIN_STEPS[Math.max(0, index - 1)] ?? current;
  }

  return INPUT_GAIN_STEPS[Math.min(INPUT_GAIN_STEPS.length - 1, index + 1)] ?? current;
}

export default function SettingsAudioScreen() {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveAudioRecordings, setSaveAudioRecordings] = useState(false);
  const [micDevices, setMicDevices] = useState<WebAudioInputDevice[]>([]);
  const [micLoading, setMicLoading] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [selectedMicId, setSelectedMicId] = useState<string | null>(null);
  const [inputGain, setInputGain] = useState(1);
  const [gainTrackWidth, setGainTrackWidth] = useState(0);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [testLevel, setTestLevel] = useState(0);
  const [testAdviceMessage, setTestAdviceMessage] = useState(
    "Start een test en spreek 5-10 seconden in voor advies.",
  );
  const [suggestedGain, setSuggestedGain] = useState<number | null>(null);

  const testStreamRef = useRef<MediaStream | null>(null);
  const testAudioContextRef = useRef<AudioContext | null>(null);
  const testGainNodeRef = useRef<GainNode | null>(null);
  const testAnalyserRef = useRef<AnalyserNode | null>(null);
  const testRafRef = useRef<number | null>(null);
  const testSamplesRef = useRef<{ at: number; level: number }[]>([]);
  const testLastAdviceRefreshRef = useRef(0);
  const testStartedAtRef = useRef(0);

  function gainDescriptor(value: number): "Zachter" | "Standaard" | "Versterken" {
    if (value < 1) {
      return "Zachter";
    }
    if (value > 1) {
      return "Versterken";
    }
    return "Standaard";
  }

  function stopMicrophoneTest() {
    if (testRafRef.current !== null) {
      cancelAnimationFrame(testRafRef.current);
      testRafRef.current = null;
    }
    if (testStreamRef.current) {
      testStreamRef.current.getTracks().forEach((track) => track.stop());
      testStreamRef.current = null;
    }
    if (testAudioContextRef.current) {
      void testAudioContextRef.current.close().catch(() => {
        // noop
      });
      testAudioContextRef.current = null;
    }
    testGainNodeRef.current = null;
    testAnalyserRef.current = null;

    setIsTestingMic(false);
    setTestLevel(0);
  }

  function analyseRecentWindow(now: number) {
    if (now - testStartedAtRef.current < TEST_INITIAL_ADVICE_DELAY_MS) {
      setTestAdviceMessage("We luisteren eerst iets langer. Blijf nog even normaal inspreken.");
      setSuggestedGain(null);
      return;
    }

    const windowStart = now - TEST_ANALYSIS_WINDOW_MS;
    const recent = testSamplesRef.current.filter((sample) => sample.at >= windowStart);
    testSamplesRef.current = recent;

    if (recent.length < 16) {
      setTestAdviceMessage("Spreek kort in zodat we je microfoonniveau goed kunnen beoordelen.");
      setSuggestedGain(null);
      return;
    }

    const speech = recent.filter((sample) => sample.level >= TEST_SPEECH_GATE);
    const speechDurationMs =
      speech.length > 1 ? speech[speech.length - 1].at - speech[0].at : 0;

    if (
      speech.length < Math.max(8, Math.floor(recent.length * 0.22)) ||
      speechDurationMs < TEST_MIN_SPEECH_DURATION_MS
    ) {
      setTestAdviceMessage("Nog te weinig stabiele spraak. Praat iets langer op normaal volume.");
      setSuggestedGain(null);
      return;
    }

    const speechPeak = Math.max(...speech.map((sample) => sample.level));
    const speechAvg =
      speech.reduce((total, sample) => total + sample.level, 0) / speech.length;

    if (speechPeak >= CLIP_ZONE_START) {
      const next = shiftGainStep(inputGain, "down");
      setSuggestedGain(next);
      setTestAdviceMessage("Clip-risico gedetecteerd. Zet opnamevolume een stap lager.");
      return;
    }

    if (speechAvg < 0.22) {
      const next = shiftGainStep(inputGain, "up");
      setSuggestedGain(next);
      setTestAdviceMessage("Je signaal is nog zacht. Zet opnamevolume een stap hoger.");
      return;
    }

    setSuggestedGain(inputGain);
    setTestAdviceMessage("Niveau is stabiel. Deze volumestand is geschikt voor opname.");
  }

  function chooseAvailableMic(devices: WebAudioInputDevice[]): string | null {
    const prefs = getWebAudioInputPreferences();
    if (prefs.selectedInputDeviceId) {
      const hasStored = devices.some((device) => device.id === prefs.selectedInputDeviceId);
      if (hasStored) {
        return prefs.selectedInputDeviceId;
      }
    }

    const first = devices[0]?.id ?? null;
    if (first) {
      updateWebAudioInputPreferences({ selectedInputDeviceId: first });
    }
    return first;
  }

  const refreshMicrophones = useCallback(async () => {
    if (Platform.OS !== "web") {
      return;
    }

    setMicLoading(true);
    setMicError(null);

    try {
      await primeWebAudioInputPermission();
      const devices = await listWebAudioInputDevices();
      setMicDevices(devices);

      const nextSelectedId = chooseAvailableMic(devices);
      setSelectedMicId(nextSelectedId);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setMicError(parsed.message);
    } finally {
      setMicLoading(false);
    }
  }, []);

  async function startMicrophoneTest(targetDeviceId?: string | null) {
    if (Platform.OS !== "web") {
      return;
    }

    stopMicrophoneTest();
    setMicError(null);

    const effectiveDeviceId = targetDeviceId ?? selectedMicId;

    try {
      const constraints: MediaTrackConstraints | boolean = effectiveDeviceId
        ? { deviceId: { exact: effectiveDeviceId } }
        : true;

      const stream = await globalThis.navigator.mediaDevices.getUserMedia({
        audio: constraints,
      });
      testStreamRef.current = stream;

      const AudioContextCtor =
        globalThis.AudioContext ||
        ((globalThis as any).webkitAudioContext as
          | (new () => AudioContext)
          | undefined);

      if (!AudioContextCtor) {
        setIsTestingMic(true);
        return;
      }

      const audioContext = new AudioContextCtor();
      testAudioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const gainNode = audioContext.createGain();
      const analyser = audioContext.createAnalyser();

      testGainNodeRef.current = gainNode;
      testAnalyserRef.current = analyser;

      gainNode.gain.value = inputGain;
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.22;

      source.connect(gainNode);
      gainNode.connect(analyser);

      setIsTestingMic(true);
      setTestAdviceMessage("Test gestart. Spreek 5 seconden in voor stabiel advies.");
      setSuggestedGain(null);
      testSamplesRef.current = [];
      testLastAdviceRefreshRef.current = 0;
      testStartedAtRef.current = Date.now();

      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sumSquares = 0;
        for (let i = 0; i < data.length; i += 1) {
          const centered = (data[i] - 128) / 128;
          sumSquares += centered * centered;
        }

        const rms = Math.sqrt(sumSquares / data.length);
        const normalized = Math.max(0, Math.min(1, rms * 5));
        setTestLevel(normalized);

        const now = Date.now();
        testSamplesRef.current.push({ at: now, level: normalized });

        if (now - testLastAdviceRefreshRef.current >= TEST_ADVICE_REFRESH_MS) {
          testLastAdviceRefreshRef.current = now;
          analyseRecentWindow(now);
        }

        testRafRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setMicError(parsed.message);
      setTestAdviceMessage("Test starten lukt nu niet. Controleer je microfoontoegang.");
      stopMicrophoneTest();
    }
  }

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);

      try {
        const prefs = await fetchUserAudioPreferences();
        if (!cancelled) {
          setSaveAudioRecordings(prefs.save_audio_recordings);

          if (Platform.OS === "web") {
            ensureWebAudioInputPreferencesApplied();
            const webPrefs = getWebAudioInputPreferences();
            setInputGain(webPrefs.inputGain);
            setSelectedMicId(webPrefs.selectedInputDeviceId);
            await refreshMicrophones();
          }
        }
      } catch (nextError) {
        const parsed = classifyUnknownError(nextError);
        if (!cancelled) {
          setError(parsed.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [refreshMicrophones]);

  useEffect(() => {
    return () => {
      stopMicrophoneTest();
    };
  }, []);

  async function persistPreference(nextValue: boolean) {
    setSaving(true);
    setError(null);
    setSaveAudioRecordings(nextValue);

    try {
      const updated = await updateUserAudioPreferences({
        saveAudioRecordings: nextValue,
      });
      setSaveAudioRecordings(updated.save_audio_recordings);
    } catch (nextError) {
      const parsed = classifyUnknownError(nextError);
      setError(parsed.message);
      setSaveAudioRecordings((value) => !value);
    } finally {
      setSaving(false);
    }
  }

  const isBusy = loading || saving;
  const gainPercent = Math.round(inputGain * 100);
  const isClippingLive = isTestingMic && testLevel >= CLIP_ZONE_START;
  const currentStep = closestGainStep(inputGain);
  const currentStepIndex = INPUT_GAIN_STEPS.indexOf(currentStep);
  const currentStepRatio =
    currentStepIndex <= 0 ? 0 : currentStepIndex / (INPUT_GAIN_STEPS.length - 1);
  const hasSuggestedChange =
    typeof suggestedGain === "number" && Math.abs(suggestedGain - inputGain) > 0.001;

  async function selectMic(deviceId: string) {
    const updated = updateWebAudioInputPreferences({ selectedInputDeviceId: deviceId });
    setSelectedMicId(updated.selectedInputDeviceId);

    if (isTestingMic) {
      await startMicrophoneTest(updated.selectedInputDeviceId);
    }
  }

  function setGain(nextGain: number) {
    const updated = updateWebAudioInputPreferences({ inputGain: nextGain });
    setInputGain(updated.inputGain);

    if (testGainNodeRef.current) {
      testGainNodeRef.current.gain.value = updated.inputGain;
    }
  }

  function gainFromTrackPress(event: GestureResponderEvent): number {
    if (gainTrackWidth <= 0) {
      return currentStep;
    }

    const ratio = clamp01(event.nativeEvent.locationX / gainTrackWidth);
    const index = Math.round(ratio * (INPUT_GAIN_STEPS.length - 1));
    return INPUT_GAIN_STEPS[Math.max(0, Math.min(INPUT_GAIN_STEPS.length - 1, index))] ?? 1;
  }

  return (
    <SettingsScaffold
      title="Audio Instellingen"
      subtitle="Beheer opnames bewaren en je microfoonvoorkeuren."
      onBack={() => router.back()}
      onMenu={() => setMenuVisible(true)}
      contentContainerStyle={styles.scrollContent}
    >

      <SurfaceSection title="Opnames bewaren">
        <SettingsStateBody>
          <SettingsStateIcon
            icon="mic"
            iconColor={palette.primary}
            backgroundColor={palette.surfaceLow}
          />

          {loading ? (
            <StateBlock
              tone="loading"
              message="Voorkeur laden..."
              detail="Een moment geduld."
            />
          ) : (
            <ThemedView style={styles.radioWrap}>
              <ChoiceInputGroup
                options={[
                  {
                    key: "off",
                    label: "Niet bewaren",
                    description:
                      "Audio wordt alleen gebruikt voor transcriptie en daarna niet opgeslagen.",
                    active: !saveAudioRecordings,
                    onPress: () => {
                      if (!isBusy && saveAudioRecordings) {
                        void persistPreference(false);
                      }
                    },
                  },
                  {
                    key: "on",
                    label: "Wel bewaren",
                    description:
                      "Audio wordt veilig opgeslagen zodat je opname later kunt afspelen en downloaden.",
                    active: saveAudioRecordings,
                    onPress: () => {
                      if (!isBusy && !saveAudioRecordings) {
                        void persistPreference(true);
                      }
                    },
                  },
                ]}
              />
            </ThemedView>
          )}

          {error ? (
            <StateBlock
              tone="error"
              message="Instelling opslaan lukt nu niet."
              detail={error}
            />
          ) : null}

          <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
            Deze keuze geldt voor nieuwe opnames. Eerder opgeslagen audio blijft ongewijzigd.
          </ThemedText>
        </SettingsStateBody>
      </SurfaceSection>

      <SurfaceSection title="Microfooninstellingen">
        <SettingsStateBody>
          <SettingsStateIcon
            icon="settings-voice"
            iconColor={palette.primary}
            backgroundColor={palette.surfaceLow}
          />

          {Platform.OS !== "web" ? (
            <StateBlock
              tone="info"
              message="Microfoonkeuze is nu eerst voor web beschikbaar."
              detail="Op native blijft de standaardmicrofoon actief."
            />
          ) : (
            <>
              <ThemedView style={styles.sectionStack}>
                <ThemedText type="defaultSemiBold">Microfoon selecteren</ThemedText>

                {micDevices.length > 0 ? (
                  <ChoiceInputGroup
                    options={micDevices.map((device) => ({
                      key: device.id,
                      label: device.label,
                      active: selectedMicId === device.id,
                      onPress: () => {
                        void selectMic(device.id);
                      },
                      disabled: micLoading,
                    }))}
                  />
                ) : (
                  <StateBlock
                    tone={micLoading ? "loading" : "info"}
                    message={
                      micLoading
                        ? "Microfoons laden..."
                        : "Nog geen microfoonlijst beschikbaar."
                    }
                    detail={
                      micLoading
                        ? "Even geduld."
                        : "Klik op 'Ververs microfoonlijst' om je apparaten op te halen."
                    }
                  />
                )}

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    void refreshMicrophones();
                  }}
                  disabled={micLoading}
                  style={[
                    styles.secondaryAction,
                    { backgroundColor: palette.surfaceLowest },
                    micLoading ? styles.actionDisabled : null,
                  ]}
                >
                  <ThemedText type="defaultSemiBold">Ververs microfoonlijst</ThemedText>
                </Pressable>
              </ThemedView>

              <ThemedView style={styles.sectionStack}>
                <ThemedText type="defaultSemiBold">Opnamevolume</ThemedText>

                <View style={styles.gainControlRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Volume lager"
                    onPress={() => setGain(shiftGainStep(inputGain, "down"))}
                    style={[
                      styles.gainStepButton,
                      { backgroundColor: palette.surfaceLowest },
                    ]}
                  >
                    <ThemedText type="defaultSemiBold">−</ThemedText>
                  </Pressable>

                  <View style={styles.gainSliderArea}>
                    <View
                      accessibilityRole="adjustable"
                      onLayout={(event) => setGainTrackWidth(event.nativeEvent.layout.width)}
                      onStartShouldSetResponder={() => true}
                      onResponderRelease={(event) => {
                        setGain(gainFromTrackPress(event));
                      }}
                      style={[
                        styles.gainTrack,
                        {
                          backgroundColor: palette.surfaceLow,
                          borderColor: palette.separator,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.gainTrackFill,
                          {
                            width: `${Math.round(currentStepRatio * 100)}%`,
                            backgroundColor: palette.primary,
                          },
                        ]}
                      />
                      <View
                        style={[
                          styles.gainClipZone,
                          { backgroundColor: palette.destructiveSoftBackground },
                        ]}
                      />

                      {INPUT_GAIN_STEPS.map((step, index) => (
                        <View
                          key={`gain-mark-${step}`}
                          style={[
                            styles.gainStepMark,
                            {
                              left: `${(index / (INPUT_GAIN_STEPS.length - 1)) * 100}%`,
                              backgroundColor:
                                Math.abs(inputGain - step) < 0.001
                                  ? palette.primaryOn
                                  : palette.separator,
                            },
                          ]}
                        />
                      ))}

                      <View
                        style={[
                          styles.gainThumb,
                          {
                            left: `${Math.round(currentStepRatio * 100)}%`,
                            backgroundColor: palette.primary,
                            borderColor: palette.background,
                          },
                        ]}
                      />
                    </View>

                    <View style={styles.gainLabelsRow}>
                      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                        50%
                      </ThemedText>
                      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                        100%
                      </ThemedText>
                      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                        150%
                      </ThemedText>
                      <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                        200%
                      </ThemedText>
                    </View>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Volume hoger"
                    onPress={() => setGain(shiftGainStep(inputGain, "up"))}
                    style={[
                      styles.gainStepButton,
                      { backgroundColor: palette.surfaceLowest },
                    ]}
                  >
                    <ThemedText type="defaultSemiBold">+</ThemedText>
                  </Pressable>
                </View>

                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  Huidig opnamevolume: {gainPercent}% ({gainDescriptor(inputGain)})
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.sectionStack}>
                <ThemedText type="defaultSemiBold">Microfoon test</ThemedText>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    void (isTestingMic ? Promise.resolve(stopMicrophoneTest()) : startMicrophoneTest());
                  }}
                  style={[
                    styles.secondaryAction,
                    {
                      backgroundColor: isTestingMic
                        ? palette.destructiveSoftBackground
                        : palette.surfaceLowest,
                    },
                  ]}
                >
                  <ThemedText type="defaultSemiBold">
                    {isTestingMic ? "Stop microfoon test" : "Start microfoon test"}
                  </ThemedText>
                </Pressable>

                <View
                  style={[
                    styles.levelTrack,
                    { backgroundColor: palette.surfaceLow, borderColor: palette.separator },
                  ]}
                >
                  <View
                    style={[
                      styles.levelClipZone,
                      { backgroundColor: palette.destructiveSoftBackground },
                    ]}
                  />
                  <View
                    style={[
                      styles.levelFill,
                      {
                        width: `${Math.round(testLevel * 100)}%`,
                        backgroundColor: isClippingLive ? palette.error : palette.primary,
                      },
                    ]}
                  />
                </View>

                <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                  Ingangsniveau: {Math.round(testLevel * 100)}%
                </ThemedText>

                <View style={styles.adviceBox}>
                  <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
                    {testAdviceMessage}
                  </ThemedText>

                  <View style={styles.adviceActionRow}>
                    {hasSuggestedChange ? (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => setGain(suggestedGain ?? inputGain)}
                        style={styles.subtleAdviceAction}
                      >
                        <ThemedText type="bodySecondary" style={{ color: palette.primary }}>
                          Pas {Math.round((suggestedGain ?? inputGain) * 100)}% toe
                        </ThemedText>
                      </Pressable>
                    ) : (
                      <View style={styles.adviceActionSpacer} />
                    )}
                  </View>
                </View>
              </ThemedView>
            </>
          )}

          {micError ? (
            <StateBlock
              tone="error"
              message="Microfooninstellingen laden lukt nu niet."
              detail={micError}
            />
          ) : null}
        </SettingsStateBody>
      </SurfaceSection>

      <ThemedView style={styles.actionsWrap}>
        <PrimaryButton
          label={saving ? "Bezig..." : "Terug naar instellingen"}
          disabled={saving}
          onPress={() => router.back()}
        />
      </ThemedView>

      <FullscreenMenuOverlay
        visible={menuVisible}
        currentRouteKey="settings"
        onRequestClose={() => setMenuVisible(false)}
      />
    </SettingsScaffold>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.content,
  },
  radioWrap: {
    width: "100%",
  },
  sectionStack: {
    width: "100%",
    gap: spacing.sm,
  },
  gainControlRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  gainStepButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  gainSliderArea: {
    flex: 1,
    gap: spacing.xs,
  },
  gainTrack: {
    width: "100%",
    height: 16,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  gainTrackFill: {
    ...StyleSheet.absoluteFillObject,
    right: "auto",
  },
  gainClipZone: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: `${Math.round((1 - CLIP_ZONE_START) * 100)}%`,
    opacity: 0.5,
  },
  gainStepMark: {
    position: "absolute",
    top: 2,
    width: 2,
    height: 12,
    marginLeft: -1,
    borderRadius: 1,
  },
  gainThumb: {
    position: "absolute",
    top: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
    borderWidth: 2,
  },
  gainLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  secondaryAction: {
    minHeight: 46,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  actionDisabled: {
    opacity: 0.56,
  },
  levelTrack: {
    width: "100%",
    height: 14,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  levelClipZone: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: `${Math.round((1 - CLIP_ZONE_START) * 100)}%`,
    opacity: 0.5,
  },
  levelFill: {
    height: "100%",
    borderRadius: 999,
  },
  adviceBox: {
    minHeight: 72,
    justifyContent: "space-between",
  },
  adviceActionRow: {
    minHeight: 24,
    justifyContent: "flex-end",
  },
  adviceActionSpacer: {
    minHeight: 24,
  },
  subtleAdviceAction: {
    alignSelf: "flex-start",
    paddingVertical: spacing.xs,
  },
  actionsWrap: {
    gap: spacing.sm,
  },
});
