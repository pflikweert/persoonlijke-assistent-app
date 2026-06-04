import { router } from "expo-router";

import { MeetingCaptureShell } from "@/components/meeting-capture/meeting-capture-shell";
import { AdminActionBar, AdminPanel } from "@/components/ui/admin-console-primitives";
import {
  StateBlock,
} from "@/components/ui/screen-primitives";

export default function MeetingCaptureNewScreen() {
  return (
    <MeetingCaptureShell
      title="Nieuwe gespreksopname"
      subtitle="Bereid een lange opname voor buiten je dagboekflow."
      meta={["Audio wordt veilig opgeslagen", "Geen dagboekmoment"]}
      onBack={() => router.push("/meeting-capture" as never)}
    >
      <AdminPanel title="Opname voorbereiden">
        <StateBlock
          tone="info"
          message="Zorg dat iedereen weet dat je dit gesprek opneemt."
          detail="Titel, type, notitie en start/stop komen in de volgende bouwslice."
        />
        <AdminActionBar
          primary={{
            label: "Start opname",
            icon: "fiber-manual-record",
            disabled: true,
            onPress: () => {},
          }}
          secondary={{
            label: "Terug naar archief",
            icon: "arrow-back",
            onPress: () => router.push("/meeting-capture" as never),
          }}
        />
      </AdminPanel>
    </MeetingCaptureShell>
  );
}
