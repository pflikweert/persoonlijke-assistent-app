import { hasAdminCapabilityAccess } from "@/services/admin-access";

export async function hasAdminMeetingCaptureAccess(): Promise<boolean> {
  return hasAdminCapabilityAccess("meeting_capture");
}
