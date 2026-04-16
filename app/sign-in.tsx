import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, View, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  AuthAmbientShell,
  AuthBrandMark,
  AuthFormStack,
  AuthHero,
  AuthTextSubtitle,
} from "@/components/ui/auth-screen-primitives";
import { NoticeCard } from "@/components/ui/notice-card";
import {
  InputField,
  PrimaryButton,
  StateBlock,
} from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sendMagicLink } from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

export default function SignInScreen() {
  const params = useLocalSearchParams<{
    auth_error?: string;
    auth_error_code?: string;
    auth_error_description?: string;
  }>();
  const { height: viewportHeight, width: viewportWidth } =
    useWindowDimensions();
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const isCompactViewport = viewportHeight < 900 || viewportWidth < 390;
  const shellMaxHeight = Math.max(520, viewportHeight - spacing.lg * 2);
  const [email, setEmail] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [successSent, setSuccessSent] = useState(false);
  const callbackError = useMemo(
    () =>
      mapAuthCallbackError({
        error: typeof params.auth_error === "string" ? params.auth_error : null,
        errorCode:
          typeof params.auth_error_code === "string"
            ? params.auth_error_code
            : null,
        errorDescription:
          typeof params.auth_error_description === "string"
            ? params.auth_error_description
            : null,
      }),
    [params.auth_error, params.auth_error_code, params.auth_error_description],
  );

  useEffect(() => {
    if (!callbackError) {
      return;
    }

    setErrorMessage(callbackError.message);
    setErrorDetail(callbackError.detail);
    setSuccessSent(false);
  }, [callbackError]);

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
    setErrorDetail(null);
    setSuccessSent(false);

    try {
      await sendMagicLink(email);
      setSuccessSent(true);
    } catch (error) {
      setErrorMessage(mapSignInError(error));
      setErrorDetail(null);
    } finally {
      setSubmitting(false);
    }
  }

  function handleBackToSignIn() {
    setSuccessSent(false);
    setSubmitting(false);
    setErrorMessage(null);
    setErrorDetail(null);
    setEmail("");
    setIsInputFocused(false);
  }

  return (
    <AuthAmbientShell
      compactViewport={isCompactViewport}
      maxHeight={shellMaxHeight}
    >
      {uiState === "success" ? (
        <View style={styles.successWrap}>
          <>
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
              <AuthTextSubtitle
                compactViewport={isCompactViewport}
                style={[
                  { color: palette.muted },
                ]}
              >
                Open de mail in je inbox om direct verder te gaan.
              </AuthTextSubtitle>
            </View>

            <NoticeCard
              title="Geen e-mail ontvangen?"
              body="Controleer ook je spam- of promotiesmap. Je kunt daarna opnieuw proberen."
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
          </>
        </View>
      ) : (
        <View style={styles.formWrap}>
          <AuthBrandMark compactViewport={isCompactViewport} />

          <AuthHero
            title="Vang je dag in woorden"
            subtitle="Voor momenten, gedachten en gebeurtenissen die je niet kwijt wilt raken."
            compactViewport={isCompactViewport}
            subtitleStyle={{ color: palette.text }}
          />

          {uiState === "error" && errorMessage ? (
            <StateBlock tone="error" message={errorMessage} detail={errorDetail} />
          ) : null}

          <AuthFormStack>
            <InputField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onBlur={() => setIsInputFocused(false)}
              onChangeText={(value) => {
                setEmail(value);
                if (errorMessage) {
                  setErrorMessage(null);
                  setErrorDetail(null);
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
              label={submitting ? "Bezig met verzenden..." : "Ontvang inloglink"}
              onPress={() => void handleSendMagicLink()}
              disabled={submitting || !hasTypedEmail}
            />
          </AuthFormStack>

          <AuthTextSubtitle compactViewport={isCompactViewport} style={styles.footnote}>
            Geen wachtwoorden nodig. Wij sturen een veilige link naar je inbox.
          </AuthTextSubtitle>
        </View>
      )}
    </AuthAmbientShell>
  );
}

function mapAuthCallbackError(input: {
  error: string | null;
  errorCode: string | null;
  errorDescription: string | null;
}): { message: string; detail: string } | null {
  const fields = [input.error, input.errorCode, input.errorDescription]
    .filter((value): value is string => Boolean(value))
    .map((value) => value.toLowerCase());

  if (fields.length === 0) {
    return null;
  }

  const combined = fields.join(" ");

  if (
    combined.includes("expired") ||
    combined.includes("otp_expired") ||
    combined.includes("email link is invalid")
  ) {
    return {
      message: "Deze inloglink is verlopen.",
      detail: "Vraag hieronder een nieuwe inloglink aan en open die direct vanuit je mail.",
    };
  }

  if (combined.includes("access_denied") || combined.includes("denied")) {
    return {
      message: "Inloggen is niet gelukt.",
      detail: "Vraag een nieuwe inloglink aan en probeer opnieuw.",
    };
  }

  return {
    message: "Deze inloglink is ongeldig of niet meer bruikbaar.",
    detail: "Vraag hieronder een nieuwe inloglink aan en probeer opnieuw.",
  };
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
  formWrap: {
    width: "100%",
    alignItems: "center",
    gap: spacing.xxl,
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
  input: {
    width: "100%",
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
  footnote: {
    textAlign: "center",
    maxWidth: 260,
    opacity: 0.76,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
  },
});
