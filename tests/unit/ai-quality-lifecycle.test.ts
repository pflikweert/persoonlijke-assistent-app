import { describe, expect, it } from "vitest";

import { getAiQualityVersionLifecycleState } from "@/src/lib/ai-quality-lifecycle";
import type { AiTaskDetail, AiTaskVersionDetail } from "@/types";

function version(input: Partial<AiTaskVersionDetail> & Pick<AiTaskVersionDetail, "id" | "versionNumber" | "status">): AiTaskVersionDetail {
  return {
    id: input.id,
    versionNumber: input.versionNumber,
    status: input.status,
    model: input.model ?? "gpt-5.4-mini",
    promptTemplate: input.promptTemplate ?? "Prompt",
    systemInstructions: input.systemInstructions ?? "System",
    outputSchemaJson: input.outputSchemaJson ?? {},
    configJson: input.configJson ?? {},
    changelog: input.changelog ?? null,
    createdAt: input.createdAt ?? "2026-06-03T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-03T00:00:00.000Z",
    becameLiveAt: input.becameLiveAt ?? null,
    lockedAt: input.lockedAt ?? null,
    completedTestRunCount: input.completedTestRunCount ?? 0,
    positiveReviewCount: input.positiveReviewCount ?? 0,
    latestReviewLabel: input.latestReviewLabel ?? null,
  };
}

function detail(versions: AiTaskVersionDetail[], liveVersionId = "live"): AiTaskDetail {
  const liveVersion = versions.find((item) => item.id === liveVersionId) ?? null;
  return {
    id: "task-id",
    key: "day_narrative",
    label: "Dagverhaal",
    inputType: "day",
    outputType: "text",
    description: null,
    isActive: true,
    runtimeBindingKey: "day_journal.primary",
    runtimeFamily: "day_journal",
    compositionRole: "compound_member",
    managedOutputField: "narrative_text",
    isRuntimeDriver: true,
    variantRole: "primary",
    hasDraft: versions.some((item) => item.status === "draft"),
    createdAt: "2026-06-03T00:00:00.000Z",
    updatedAt: "2026-06-03T00:00:00.000Z",
    liveVersion: liveVersion
      ? {
          id: liveVersion.id,
          versionNumber: liveVersion.versionNumber,
          status: liveVersion.status,
          model: liveVersion.model,
          createdAt: liveVersion.createdAt,
          updatedAt: liveVersion.updatedAt,
          becameLiveAt: liveVersion.becameLiveAt,
          lockedAt: liveVersion.lockedAt,
        }
      : null,
    versions,
  };
}

describe("ai-quality lifecycle helper", () => {
  it("marks the current live version", () => {
    const live = version({ id: "live", versionNumber: 1, status: "live" });

    expect(getAiQualityVersionLifecycleState(detail([live]), live)).toMatchObject({
      id: "current_live",
      action: null,
      canRunAction: false,
    });
  });

  it("requires a completed test before draft promotion", () => {
    const draft = version({ id: "draft", versionNumber: 2, status: "draft" });

    expect(getAiQualityVersionLifecycleState(detail([draft], ""), draft)).toMatchObject({
      id: "draft_needs_test",
      label: "Test nodig",
      action: null,
    });
  });

  it("requires a positive review after a completed test", () => {
    const draft = version({
      id: "draft",
      versionNumber: 2,
      status: "draft",
      completedTestRunCount: 1,
      positiveReviewCount: 0,
      latestReviewLabel: "slechter",
    });

    expect(getAiQualityVersionLifecycleState(detail([draft], ""), draft)).toMatchObject({
      id: "draft_needs_positive_review",
      label: "Review nodig",
      action: null,
    });
  });

  it("allows draft promotion with better or equal review evidence", () => {
    const draft = version({
      id: "draft",
      versionNumber: 2,
      status: "draft",
      completedTestRunCount: 1,
      positiveReviewCount: 1,
      latestReviewLabel: "gelijk",
    });

    expect(getAiQualityVersionLifecycleState(detail([draft], ""), draft)).toMatchObject({
      id: "draft_ready_to_promote",
      action: "promote",
      actionLabel: "Zet live",
      canRunAction: true,
    });
  });

  it("allows rollback only for archived versions that were live before", () => {
    const rollbackable = version({
      id: "old-live",
      versionNumber: 1,
      status: "archived",
      becameLiveAt: "2026-06-02T00:00:00.000Z",
    });
    const archivedDraft = version({ id: "archived-draft", versionNumber: 2, status: "archived" });

    expect(getAiQualityVersionLifecycleState(detail([rollbackable], ""), rollbackable)).toMatchObject({
      id: "archived_can_rollback",
      action: "rollback",
      actionLabel: "Rollback naar deze versie",
    });
    expect(getAiQualityVersionLifecycleState(detail([archivedDraft], ""), archivedDraft)).toMatchObject({
      id: "archived_not_rollbackable",
      action: null,
    });
  });
});
