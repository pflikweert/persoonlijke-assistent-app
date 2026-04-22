import type { SelectableDay } from "@/services";
import { SelectableListModal } from "./selectable-list-modal";

type DaySelectorModalProps = {
  visible: boolean;
  title: string;
  titlePrefix?: string;
  subtitle: string;
  loading?: boolean;
  errorMessage?: string | null;
  days: SelectableDay[];
  selectedDate?: string | null;
  onClose: () => void;
  onSelect: (day: SelectableDay) => void;
};

export function DaySelectorModal({
  visible,
  title,
  titlePrefix,
  subtitle,
  loading = false,
  errorMessage,
  days,
  selectedDate,
  onClose,
  onSelect,
}: DaySelectorModalProps) {
  return (
    <SelectableListModal
      visible={visible}
      title={title}
      titlePrefix={titlePrefix}
      subtitle={subtitle}
      loading={loading}
      loadingMessage="Dagen laden..."
      errorMessage={!loading && errorMessage ? "Dagen laden lukt nu niet." : null}
      errorDetail={errorMessage ?? undefined}
      emptyMessage="Je hebt nog geen dagen om te kiezen."
      emptyDetail="Leg eerst iets vast, dan verschijnt het hier."
      items={days.map((day) => ({
        key: day.date,
        title: day.label,
        subtitle: day.snippet,
        selected: selectedDate ? day.date === selectedDate : false,
      }))}
      onClose={onClose}
      onSelect={(itemKey) => {
        const selected = days.find((day) => day.date === itemKey);
        if (selected) {
          onSelect(selected);
        }
      }}
    />
  );
}
