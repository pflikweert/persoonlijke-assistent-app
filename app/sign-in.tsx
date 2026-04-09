import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  InputField,
  PrimaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sendMagicLink } from "@/services";
import { colorTokens, radius, shadows, spacing, typography } from "@/theme";

const LOGIN_BG_LIGHT = require("../assets/images/login/login-bg-light-mode.png");
const LOGIN_BG_DARK = require("../assets/images/login/login-bg-dark-mode.png");

export default function SignInScreen() {
  const { height: viewportHeight, width: viewportWidth } =
    useWindowDimensions();
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const isCompactViewport = viewportHeight < 900 || viewportWidth < 390;
  const shellMaxHeight = Math.max(520, viewportHeight - spacing.lg * 2);
  const loginBackground = scheme === "dark" ? LOGIN_BG_DARK : LOGIN_BG_LIGHT;
  const overlayColor =
    scheme === "dark" ? "rgba(9, 8, 7, 0.52)" : "rgba(250, 249, 246, 0.52)";
  const contentShellBackground =
    scheme === "dark" ? "rgba(43, 41, 37, 0.72)" : "rgba(255, 255, 255, 0.78)";
  const contentShellBorder =
    scheme === "dark" ? "rgba(244, 241, 232, 0.14)" : "rgba(116, 91, 0, 0.1)";
  const [email, setEmail] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successSent, setSuccessSent] = useState(false);

  const hasTypedEmail = email.trim().length > 0;
  const isInputActive = isInputFocused || hasTypedEmail;
  const uiState: "default" | "submitting" | "error" | "success" = successSent
    ? "success"
    : submitting
      ? "submitting"
      : errorMessage
        ? "error"
        : "default";

  async function handleSendMagicLink() {
    if (submitting) {
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSuccessSent(false);

    try {
      await sendMagicLink(email);
      setSuccessSent(true);
    } catch (error) {
      setErrorMessage(mapSignInError(error));
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackToSignIn() {
    setSuccessSent(false);
    setSubmitting(false);
    setErrorMessage(null);
    setEmail("");
    setIsInputFocused(false);
  }

  return (
    <ImageBackground
      source={loginBackground}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]}>
        <View style={styles.container}>
          <View
            style={[
              styles.contentShell,
              isCompactViewport && styles.contentShellCompact,
              { maxHeight: shellMaxHeight },
              {
                backgroundColor: contentShellBackground,
                borderColor: contentShellBorder,
              },
            ]}
          >
            {uiState === "success" ? (
              <View style={styles.successWrap}>
                <View style={styles.successIconCluster}>
                  <View
                    style={[
                      styles.successIconShell,
                      isCompactViewport && styles.successIconShellCompact,
                      { backgroundColor: `${palette.primaryStrong}26` },
                    ]}
                  >
                    <MaterialIcons
                      name="mark-email-read"
                      size={54}
                      color={palette.primary}
                    />
                  </View>
                  <View
                    style={[
                      styles.successBadge,
                      isCompactViewport && styles.successBadgeCompact,
                      {
                        backgroundColor: palette.surfaceLowest,
                        borderColor: `${palette.primaryStrong}66`,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={palette.primary}
                    />
                  </View>
                </View>

                <View style={styles.successCopy}>
                  <ThemedText
                    type="screenTitle"
                    style={[
                      styles.headline,
                      isCompactViewport && styles.headlineCompact,
                    ]}
                  >
                    De link is onderweg
                  </ThemedText>
                  <ThemedText
                    type="bodySecondary"
                    style={[
                      styles.subtitle,
                      isCompactViewport && styles.subtitleCompact,
                      { color: palette.muted },
                    ]}
                  >
                    We hebben een inloglink gestuurd. Open de mail in je inbox
                    om direct verder te gaan.
                  </ThemedText>
                </View>

                <StateBlock
                  tone="info"
                  message="Geen e-mail ontvangen?"
                  detail="Controleer ook je spam- of promotiesmap. Je kunt daarna opnieuw proberen."
                />

                <Pressable onPress={handleBackToSignIn} style={styles.backLink}>
                  <MaterialIcons
                    name="arrow-back"
                    size={18}
                    color={palette.muted}
                  />
                  <ThemedText
                    type="bodySecondary"
                    style={{ color: palette.muted }}
                  >
                    Terug naar inloggen
                  </ThemedText>
                </Pressable>
              </View>
            ) : (
              <View style={styles.formWrap}>
                <View style={styles.hero}>
                  <ThemedText
                    type="screenTitle"
                    style={[
                      styles.headline,
                      isCompactViewport && styles.headlineCompact,
                    ]}
                  >
                    Vang je dag in woorden
                  </ThemedText>
                  <ThemedText
                    type="bodySecondary"
                    style={[
                      styles.subtitle,
                      isCompactViewport && styles.subtitleCompact,
                      { color: palette.muted },
                    ]}
                  >
                    Voor momenten, gedachten en gebeurtenissen die je niet kwijt
                    wilt raken.
                  </ThemedText>
                  <ThemedText
                    type="bodySecondary"
                    style={[
                      styles.formLead,
                      isCompactViewport && styles.formLeadCompact,
                      { color: palette.muted },
                    ]}
                  >
                    Vul je e-mailadres in. We sturen je een link waarmee je
                    direct kunt inloggen.
                  </ThemedText>
                </View>

                {uiState === "error" && errorMessage ? (
                  <StateBlock tone="error" message={errorMessage} />
                ) : null}

                <InputField
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  onBlur={() => setIsInputFocused(false)}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (errorMessage) {
                      setErrorMessage(null);
                    }
                  }}
                  onFocus={() => setIsInputFocused(true)}
                  placeholder="Je e-mailadres"
                  placeholderTextColor={palette.mutedSoft}
                  style={[
                    styles.input,
                    {
                      color: palette.text,
                      backgroundColor: `${palette.surfaceLow}E8`,
                      borderColor: `${palette.separator}88`,
                    },
                    isInputActive && {
                      backgroundColor: `${palette.surfaceLowest}F4`,
                      borderColor:
                        uiState === "error"
                          ? `${palette.error}66`
                          : `${palette.primaryStrong}88`,
                    },
                  ]}
                  textContentType="emailAddress"
                  value={email}
                />

                <PrimaryButton
                  label={
                    submitting ? "Bezig met verzenden..." : "Ontvang inloglink"
                  }
                  onPress={() => void handleSendMagicLink()}
                  disabled={submitting || !hasTypedEmail}
                />

                <ThemedText
                  type="caption"
                  style={[styles.footnote, { color: palette.mutedSoft }]}
                >
                  We sturen je een e-mail met een link waarmee je veilig verder
                  kunt.
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

function mapSignInError(error: unknown): string {
  const fallback =
    "Het lukt nu even niet om de inlogmail te versturen. Probeer het zo opnieuw.";

  if (!(error instanceof Error)) {
    return fallback;
  }

  const message = error.message.toLowerCase();

  if (message.includes("e-mailadres") || message.includes("email")) {
    return "Controleer je e-mailadres en probeer opnieuw.";
  }

  if (
    message.includes("network") ||
    message.includes("verbinding") ||
    message.includes("fetch")
  ) {
    return "Je verbinding lijkt instabiel. Probeer het opnieuw zodra je internet goed werkt.";
  }

  if (message.includes("rate") || message.includes("too many")) {
    return "Je hebt net al een link aangevraagd. Wacht even en probeer dan opnieuw.";
  }

  return fallback;
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    overflow: "hidden",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    overflow: "hidden",
  },
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  contentShell: {
    width: "100%",
    maxWidth: 430,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    justifyContent: "center",
    ...shadows.surface,
  },
  contentShellCompact: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  formWrap: {
    width: "100%",
    alignItems: "center",
    gap: spacing.md,
  },
  hero: {
    width: "100%",
    alignItems: "center",
    gap: spacing.sm,
  },
  headline: {
    textAlign: "center",
    fontSize: 40,
    lineHeight: 44,
    maxWidth: "100%",
  },
  headlineCompact: {
    fontSize: 34,
    lineHeight: 38,
  },
  subtitle: {
    textAlign: "center",
    maxWidth: "100%",
    fontSize: typography.roles.body.size + 1,
    lineHeight: typography.roles.body.lineHeight + 3,
  },
  subtitleCompact: {
    lineHeight: typography.roles.body.lineHeight + 1,
  },
  formLead: {
    textAlign: "center",
    maxWidth: "100%",
    fontSize: typography.roles.body.size + 1,
    lineHeight: typography.roles.body.lineHeight + 3,
    marginTop: spacing.md,
  },
  formLeadCompact: {
    marginTop: spacing.sm,
  },
  input: {
    width: "100%",
  },
  footnote: {
    textAlign: "center",
    maxWidth: "100%",
  },
  successWrap: {
    width: "100%",
    alignItems: "center",
    gap: spacing.lg,
  },
  successIconCluster: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  successIconShell: {
    width: 116,
    height: 116,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconShellCompact: {
    alignItems: "center",
    justifyContent: "center",
  },
  successBadge: {
    position: "absolute",
    top: -2,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
  },
  successBadgeCompact: {
    right: 10,
  },
  successCopy: {
    alignItems: "center",
    gap: spacing.md,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
});
