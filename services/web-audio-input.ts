import { Platform } from "react-native";

const WEB_AUDIO_INPUT_STORAGE_KEY = "pa.audio.web-input.v1";
const DEFAULT_WEB_MIC_INPUT_GAIN = 1;

export type WebAudioInputPreferences = {
  selectedInputDeviceId: string | null;
  inputGain: number;
};

export type WebAudioInputDevice = {
  id: string;
  label: string;
};

let webAudioInputOverrideInstalled = false;

function getWebStorage(): Storage | null {
  if (Platform.OS !== "web") {
    return null;
  }

  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function clampInputGain(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_WEB_MIC_INPUT_GAIN;
  }

  return Math.max(0.5, Math.min(2, value));
}

export function getWebAudioInputPreferences(): WebAudioInputPreferences {
  const storage = getWebStorage();
  if (!storage) {
    return {
      selectedInputDeviceId: null,
      inputGain: DEFAULT_WEB_MIC_INPUT_GAIN,
    };
  }

  try {
    const raw = storage.getItem(WEB_AUDIO_INPUT_STORAGE_KEY);
    if (!raw) {
      return {
        selectedInputDeviceId: null,
        inputGain: DEFAULT_WEB_MIC_INPUT_GAIN,
      };
    }

    const parsed = JSON.parse(raw) as {
      selectedInputDeviceId?: unknown;
      inputGain?: unknown;
    };

    return {
      selectedInputDeviceId:
        typeof parsed.selectedInputDeviceId === "string" &&
        parsed.selectedInputDeviceId.trim().length > 0
          ? parsed.selectedInputDeviceId
          : null,
      inputGain:
        typeof parsed.inputGain === "number"
          ? clampInputGain(parsed.inputGain)
          : DEFAULT_WEB_MIC_INPUT_GAIN,
    };
  } catch {
    return {
      selectedInputDeviceId: null,
      inputGain: DEFAULT_WEB_MIC_INPUT_GAIN,
    };
  }
}

export function updateWebAudioInputPreferences(
  update: Partial<WebAudioInputPreferences>,
): WebAudioInputPreferences {
  const current = getWebAudioInputPreferences();
  const next: WebAudioInputPreferences = {
    selectedInputDeviceId:
      update.selectedInputDeviceId === undefined
        ? current.selectedInputDeviceId
        : update.selectedInputDeviceId,
    inputGain:
      typeof update.inputGain === "number"
        ? clampInputGain(update.inputGain)
        : current.inputGain,
  };

  const storage = getWebStorage();
  if (storage) {
    storage.setItem(WEB_AUDIO_INPUT_STORAGE_KEY, JSON.stringify(next));
  }

  return next;
}

export async function listWebAudioInputDevices(): Promise<WebAudioInputDevice[]> {
  if (
    Platform.OS !== "web" ||
    !globalThis.navigator?.mediaDevices?.enumerateDevices
  ) {
    return [];
  }

  const devices = await globalThis.navigator.mediaDevices.enumerateDevices();
  return devices
    .filter((device) => device.kind === "audioinput")
    .map((device, index) => ({
      id: device.deviceId,
      label: device.label || `Microfoon ${index + 1}`,
    }));
}

export async function primeWebAudioInputPermission(): Promise<void> {
  if (
    Platform.OS !== "web" ||
    !globalThis.navigator?.mediaDevices?.getUserMedia
  ) {
    return;
  }

  const stream = await globalThis.navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  stream.getTracks().forEach((track) => track.stop());
}

export function ensureWebAudioInputPreferencesApplied() {
  if (Platform.OS !== "web") {
    return;
  }

  if (webAudioInputOverrideInstalled) {
    return;
  }

  const mediaDevices = globalThis.navigator?.mediaDevices;
  if (!mediaDevices?.getUserMedia) {
    return;
  }

  const originalGetUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);

  mediaDevices.getUserMedia = async (
    constraints?: MediaStreamConstraints,
  ): Promise<MediaStream> => {
    const audioConstraints = constraints?.audio;
    if (!audioConstraints) {
      return originalGetUserMedia(constraints);
    }

    const prefs = getWebAudioInputPreferences();

    let nextAudioConstraints: MediaTrackConstraints | boolean = audioConstraints;
    if (audioConstraints === true) {
      nextAudioConstraints = {};
    }

    if (typeof nextAudioConstraints === "object") {
      const patched: MediaTrackConstraints = {
        ...(nextAudioConstraints ?? {}),
      };
      if (prefs.selectedInputDeviceId && !patched.deviceId) {
        patched.deviceId = { exact: prefs.selectedInputDeviceId };
      }
      nextAudioConstraints = patched;
    }

    const nextConstraints: MediaStreamConstraints = {
      ...(constraints ?? {}),
      audio: nextAudioConstraints,
    };

    const rawStream = await originalGetUserMedia(nextConstraints);
    if (Math.abs(prefs.inputGain - 1) < 0.001) {
      return rawStream;
    }

    const AudioContextCtor =
      globalThis.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((globalThis as any).webkitAudioContext as
        | (new () => AudioContext)
        | undefined);

    if (!AudioContextCtor) {
      return rawStream;
    }

    const audioContext = new AudioContextCtor();
    const source = audioContext.createMediaStreamSource(rawStream);
    const gainNode = audioContext.createGain();
    const destination = audioContext.createMediaStreamDestination();

    gainNode.gain.value = clampInputGain(prefs.inputGain);
    source.connect(gainNode);
    gainNode.connect(destination);

    const processedStream = destination.stream;
    const cleanup = () => {
      rawStream.getTracks().forEach((track) => track.stop());
      void audioContext.close().catch(() => {
        // noop
      });
    };

    processedStream.getTracks().forEach((track) => {
      track.addEventListener("ended", cleanup);
    });

    return processedStream;
  };

  webAudioInputOverrideInstalled = true;
}
