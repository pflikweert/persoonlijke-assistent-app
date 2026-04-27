import { router, useLocalSearchParams } from "expo-router";

import { MeetingCaptureShell } from "@/components/meeting-capture/meeting-capture-shell";
import { AdminReadOnlyBlock, AdminSection } from "@/components/ui/settings-screen-primitives";
import { SecondaryButton, StateBlock } from "@/components/ui/screen-primitives";

export default function MeetingCaptureDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const recordingId = Array.isArray(id) ? id[0] : id;

  return (
    <MeetingCaptureShell
      title="Gespreksopname"
      subtitle="Audio, status en download komen hier samen."
      meta={recordingId ? [`ID ${recordingId}`] : []}
      onBack={() => router.push("/meeting-capture" as never)}
    >
      {!recordingId ? (
        <AdminSection>
          <StateBlock
            tone="error"
            message="Opname niet gevonden."
            detail="Ga terug naar het archief en kies een opname."
          />
          <SecondaryButton
            label="Terug naar archief"
            icon="arrow-back"
            size="cta"
            onPress={() => router.push("/meeting-capture" as never)}
          />
        </AdminSection>
      ) : (
        <>
          <AdminSection title="Playback">
            <StateBlock
              tone="info"
              message="Opname nog niet geladen."
              detail="Playback en download volgen zodra storage en uploadstatus zijn gebouwd."
            />
          </AdminSection>

          <AdminSection title="Status">
            <AdminReadOnlyBlock
              title="Recording"
              lines={[
                `ID: ${recordingId}`,
                "Uploadstatus: volgt",
                "Transcriptstatus: niet onderdeel van v1",
              ]}
            />
          </AdminSection>
        </>
      )}
    </MeetingCaptureShell>
  );
}
