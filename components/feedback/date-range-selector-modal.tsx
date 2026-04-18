import { useMemo, useState } from "react";

import type { DateScope, SelectableDay } from "@/services";

import { DaySelectorModal } from "./day-selector-modal";

type DateRangeSelectorModalProps = {
  visible: boolean;
  loading?: boolean;
  errorMessage?: string | null;
  days: SelectableDay[];
  onClose: () => void;
  onSelect: (scope: Extract<DateScope, { kind: "range" }>) => void;
};

export function DateRangeSelectorModal({
  visible,
  loading = false,
  errorMessage,
  days,
  onClose,
  onSelect,
}: DateRangeSelectorModalProps) {
  const [step, setStep] = useState<"start" | "end">("start");
  const [startDate, setStartDate] = useState<string | null>(null);

  const startDayLabel = useMemo(() => {
    if (!startDate) {
      return null;
    }
    return days.find((day) => day.date === startDate)?.label ?? startDate;
  }, [days, startDate]);

  function handleClose() {
    setStep("start");
    setStartDate(null);
    onClose();
  }

  function handleDaySelect(day: SelectableDay) {
    if (step === "start") {
      setStartDate(day.date);
      setStep("end");
      return;
    }

    const fallbackStart = startDate ?? day.date;
    const nextStart = fallbackStart <= day.date ? fallbackStart : day.date;
    const nextEnd = fallbackStart <= day.date ? day.date : fallbackStart;

    onSelect({
      kind: "range",
      startDate: nextStart,
      endDate: nextEnd,
    });

    setStep("start");
    setStartDate(null);
    onClose();
  }

  const headerTitle = step === "start" ? "een dag" : "een einddag";
  const subtitle =
    step === "start"
      ? "Vanaf deze dag begint je selectie."
      : startDayLabel
        ? `Begint op ${startDayLabel}. Tot en met welke dag wil je bewaren?`
        : "Tot en met welke dag wil je bewaren?";

  return (
    <DaySelectorModal
      visible={visible}
      title={headerTitle}
      subtitle={subtitle}
      loading={loading}
      errorMessage={errorMessage}
      days={days}
      selectedDate={step === "end" ? startDate : null}
      onClose={handleClose}
      onSelect={handleDaySelect}
    />
  );
}
