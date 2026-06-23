import type { AiTaskDetail, AiTaskVersionDetail } from "@/types";

export type AiQualityVersionLifecycleStateId =
  | "current_live"
  | "draft_needs_test"
  | "draft_needs_positive_review"
  | "draft_ready_to_promote"
  | "archived_can_rollback"
  | "archived_not_rollbackable"
  | "version_inactive";

export type AiQualityVersionLifecycleAction = "promote" | "rollback" | null;

export type AiQualityVersionLifecycleState = {
  id: AiQualityVersionLifecycleStateId;
  label: string;
  detail: string;
  action: AiQualityVersionLifecycleAction;
  actionLabel: string | null;
  canRunAction: boolean;
};

export type AiQualityVersionManagementState = {
  canView: boolean;
  canDeleteDraft: boolean;
  canDeleteArchived: boolean;
  deleteBlockedReason: string | null;
};

export type AiQualityArchivedCleanupPlan = {
  keepLatest: number;
  archivedCount: number;
  deletableVersionIds: string[];
  skippedVersionIds: string[];
};

export function getAiQualityVersionLifecycleState(
  detail: AiTaskDetail,
  version: AiTaskVersionDetail
): AiQualityVersionLifecycleState {
  const isCurrentLive = detail.liveVersion?.id === version.id || version.status === "live";

  if (isCurrentLive) {
    return {
      id: "current_live",
      label: "Live",
      detail: "Deze versie wordt nu door de runtime gebruikt.",
      action: null,
      actionLabel: null,
      canRunAction: false,
    };
  }

  if (version.status === "draft") {
    if (version.completedTestRunCount <= 0) {
      return {
        id: "draft_needs_test",
        label: "Test nodig",
        detail: "Run eerst een test op deze draft.",
        action: null,
        actionLabel: null,
        canRunAction: false,
      };
    }

    if (version.positiveReviewCount <= 0) {
      return {
        id: "draft_needs_positive_review",
        label: "Review nodig",
        detail: "Sla eerst een oordeel beter of gelijk op.",
        action: null,
        actionLabel: null,
        canRunAction: false,
      };
    }

    return {
      id: "draft_ready_to_promote",
      label: "Klaar voor live",
      detail: "Deze draft heeft positief bewijs en kan live.",
      action: "promote",
      actionLabel: "Zet live",
      canRunAction: true,
    };
  }

  if (version.status === "archived") {
    if (version.becameLiveAt) {
      return {
        id: "archived_can_rollback",
        label: "Rollbackbaar",
        detail: "Deze versie was eerder live en kan worden teruggezet.",
        action: "rollback",
        actionLabel: "Rollback naar deze versie",
        canRunAction: true,
      };
    }

    return {
      id: "archived_not_rollbackable",
      label: "Archived",
      detail: "Alleen eerder live geweest versies kunnen worden teruggezet.",
      action: null,
      actionLabel: null,
      canRunAction: false,
    };
  }

  return {
    id: "version_inactive",
    label: "Versie",
    detail: "Deze versie is niet beschikbaar voor livegang.",
    action: null,
    actionLabel: null,
    canRunAction: false,
  };
}

export function isAiQualityVersionPromotable(detail: AiTaskDetail, version: AiTaskVersionDetail): boolean {
  return getAiQualityVersionLifecycleState(detail, version).action === "promote";
}

export function isAiQualityVersionRollbackable(detail: AiTaskDetail, version: AiTaskVersionDetail): boolean {
  return getAiQualityVersionLifecycleState(detail, version).action === "rollback";
}

export function getAiQualityVersionManagementState(
  detail: AiTaskDetail,
  version: AiTaskVersionDetail,
  options: { runtimeLinkedVersionIds?: ReadonlySet<string> } = {}
): AiQualityVersionManagementState {
  const isCurrentLive = detail.liveVersion?.id === version.id || version.status === "live";
  const hasRuntimeLinks = options.runtimeLinkedVersionIds?.has(version.id) === true;

  if (isCurrentLive) {
    return {
      canView: true,
      canDeleteDraft: false,
      canDeleteArchived: false,
      deleteBlockedReason: "Live versies kunnen niet worden verwijderd.",
    };
  }

  if (version.status === "draft") {
    return {
      canView: true,
      canDeleteDraft: true,
      canDeleteArchived: false,
      deleteBlockedReason: null,
    };
  }

  if (version.status === "archived") {
    return {
      canView: true,
      canDeleteDraft: false,
      canDeleteArchived: !hasRuntimeLinks,
      deleteBlockedReason: hasRuntimeLinks
        ? "Deze versie is gekoppeld aan runtime logs en blijft bewaard."
        : null,
    };
  }

  return {
    canView: true,
    canDeleteDraft: false,
    canDeleteArchived: false,
    deleteBlockedReason: "Deze versie kan niet worden verwijderd.",
  };
}

export function getAiQualityArchivedCleanupPlan(
  detail: AiTaskDetail,
  options: {
    keepLatest?: number;
    runtimeLinkedVersionIds?: ReadonlySet<string>;
  } = {}
): AiQualityArchivedCleanupPlan {
  const keepLatest = Math.max(0, Math.floor(options.keepLatest ?? 3));
  const archivedVersions = detail.versions
    .filter((version) => version.status === "archived")
    .sort((left, right) => right.versionNumber - left.versionNumber);
  const candidates = archivedVersions.slice(keepLatest);
  const runtimeLinkedVersionIds = options.runtimeLinkedVersionIds ?? new Set<string>();
  return {
    keepLatest,
    archivedCount: archivedVersions.length,
    deletableVersionIds: candidates
      .filter((version) => !runtimeLinkedVersionIds.has(version.id))
      .map((version) => version.id),
    skippedVersionIds: candidates
      .filter((version) => runtimeLinkedVersionIds.has(version.id))
      .map((version) => version.id),
  };
}
