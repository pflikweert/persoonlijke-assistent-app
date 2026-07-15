// @ts-ignore -- Deno runtime requires local import extensions.
import { AiRuntimeBindingError, type LiveAiRuntimeBinding } from './aiqs-runtime.ts';

export type AiqsRepairFlowResult<T> =
  | { status: 'primary'; value: T }
  | { status: 'repaired'; value: T }
  | { status: 'failed'; reason: 'repair_failed'; failureReasons: string[] };

type RepairBindingKey = 'entry_normalization.repair' | 'day_journal.repair';

function assertRepairBinding(
  expectedBindingKey: RepairBindingKey,
  binding: LiveAiRuntimeBinding | null | undefined,
): asserts binding is LiveAiRuntimeBinding {
  if (
    !binding ||
    binding.runtimeBindingKey !== expectedBindingKey ||
    binding.compositionRole !== 'runtime_variant' ||
    binding.isRuntimeDriver ||
    binding.variantRole !== 'repair' ||
    !binding.taskKey ||
    !binding.versionId
  ) {
    throw new AiRuntimeBindingError(
      'task_metadata_invalid',
      `AIQS repair binding ${expectedBindingKey} is missing or invalid.`,
      {
        bindingKey: binding?.runtimeBindingKey ?? expectedBindingKey,
        ...(binding?.taskKey ? { taskKey: binding.taskKey } : {}),
        ...(binding?.versionId ? { versionId: binding.versionId } : {}),
        field: 'repair_binding',
      },
    );
  }
}

export async function runAiqsRepairFlow<T>(args: {
  primaryValue: T;
  primaryFailureReasons: string[];
  expectedRepairBindingKey: RepairBindingKey;
  repairBinding: LiveAiRuntimeBinding | null | undefined;
  callRepair: (binding: LiveAiRuntimeBinding) => Promise<T | null>;
  getRepairFailureReasons: (value: T) => string[];
  missingRepairResultReason: string;
}): Promise<AiqsRepairFlowResult<T>> {
  if (args.primaryFailureReasons.length === 0) {
    return { status: 'primary', value: args.primaryValue };
  }

  assertRepairBinding(args.expectedRepairBindingKey, args.repairBinding);
  const repairedValue = await args.callRepair(args.repairBinding);
  if (!repairedValue) {
    return {
      status: 'failed',
      reason: 'repair_failed',
      failureReasons: [args.missingRepairResultReason],
    };
  }

  const failureReasons = args.getRepairFailureReasons(repairedValue);
  if (failureReasons.length > 0) {
    return { status: 'failed', reason: 'repair_failed', failureReasons };
  }

  return { status: 'repaired', value: repairedValue };
}
