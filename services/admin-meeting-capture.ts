import {
  hasAdminAiQualityStudioAccess,
} from "@/services/ai-quality-studio";
import { hasAdminRegenerationAccess } from "@/services/admin-regeneration";

export async function hasAdminMeetingCaptureAccess(): Promise<boolean> {
  const checks = await Promise.allSettled([
    hasAdminAiQualityStudioAccess(),
    hasAdminRegenerationAccess(),
  ]);

  if (checks.some((check) => check.status === "fulfilled" && check.value)) {
    return true;
  }

  const rejected = checks.find((check) => check.status === "rejected");
  if (rejected?.status === "rejected") {
    throw rejected.reason;
  }

  return false;
}
