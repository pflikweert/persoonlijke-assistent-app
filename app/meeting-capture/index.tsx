import { router } from "expo-router";

import { MeetingCaptureShell } from "@/components/meeting-capture/meeting-capture-shell";
import { AdminSection } from "@/components/ui/settings-screen-primitives";
import { PrimaryButton, StateBlock } from "@/components/ui/screen-primitives";

export default function MeetingCaptureOverviewScreen() {
  return (
    <MeetingCaptureShell
      title="Gespreksopnames"
      subtitle="Lange gesprekken leg je hier vast, buiten je dagboekflow."
      meta={["Admin-only", "Audio-first"]}
      onBack={() => router.push("/settings")}
    >
      <AdminSection title="Archief">
        <StateBlock
          tone="empty"
          message="Nog geen gespreksopnames."
          detail="Neem een lang gesprek op buiten je dagboekflow."
        />
        <PrimaryButton
          label="Start opname"
          icon="fiber-manual-record"
          onPress={() => router.push("/meeting-capture/new" as never)}
        />
      </AdminSection>

      <AdminSection title="Status">
        <StateBlock
          tone="info"
          message="Audio veilig opnemen is de eerste stap."
          detail="Recorder, recovery en upload volgen in de volgende bouwtaken."
        />
      </AdminSection>
    </MeetingCaptureShell>
  );
}
