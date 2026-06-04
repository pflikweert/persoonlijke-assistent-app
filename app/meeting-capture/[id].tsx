import { router, useLocalSearchParams } from "expo-router";

import { MeetingCaptureShell } from "@/components/meeting-capture/meeting-capture-shell";
import { AdminActionBar, AdminConsoleKeyValue, AdminPanel } from "@/components/ui/admin-console-primitives";
import { StateBlock } from "@/components/ui/screen-primitives";

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
        <AdminPanel>
          <StateBlock
            tone="error"
            message="Opname niet gevonden."
            detail="Ga terug naar het archief en kies een opname."
          />
          <AdminActionBar
            secondary={{
              label: "Terug naar archief",
              icon: "arrow-back",
              onPress: () => router.push("/meeting-capture" as never),
            }}
          />
        </AdminPanel>
      ) : (
        <>
          <AdminPanel title="Playback">
            <StateBlock
              tone="info"
              message="Opname nog niet geladen."
              detail="Playback en download volgen zodra storage en uploadstatus zijn gebouwd."
            />
          </AdminPanel>

          <AdminPanel title="Status">
            <AdminConsoleKeyValue label="ID" value={recordingId} />
            <AdminConsoleKeyValue label="Uploadstatus" value="Volgt" />
            <AdminConsoleKeyValue label="Transcriptstatus" value="Niet onderdeel van v1" />
          </AdminPanel>
        </>
      )}
    </MeetingCaptureShell>
  );
}
