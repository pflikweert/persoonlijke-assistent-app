import type { SelectablePeriod } from "@/services";
import { SelectableListModal } from "./selectable-list-modal";

type PeriodSelectorModalProps = {
  visible: boolean;
  title: string;
  subtitle: string;
  loading?: boolean;
  errorMessage?: string | null;
  periods: SelectablePeriod[];
  emptyMessage: string;
  emptyDetail: string;
  onClose: () => void;
  onSelect: (period: SelectablePeriod) => void;
};

export function PeriodSelectorModal({
  visible,
  title,
  subtitle,
  loading = false,
  errorMessage,
  periods,
  emptyMessage,
  emptyDetail,
  onClose,
  onSelect,
}: PeriodSelectorModalProps) {
  return (
    <SelectableListModal
      visible={visible}
      title={title}
      subtitle={subtitle}
      loading={loading}
      loadingMessage="Opties laden..."
      errorMessage={!loading && errorMessage ? "Opties laden lukt nu niet." : null}
      errorDetail={errorMessage ?? undefined}
      emptyMessage={emptyMessage}
      emptyDetail={emptyDetail}
      items={periods.map((period) => ({
        key: period.id,
        title: period.label,
        subtitle: period.subtitle,
      }))}
      onClose={onClose}
      onSelect={(itemKey) => {
        const selected = periods.find((period) => period.id === itemKey);
        if (selected) {
          onSelect(selected);
        }
      }}
    />
  );
}
