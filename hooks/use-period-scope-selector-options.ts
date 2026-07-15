import { useCallback, useMemo, useState } from "react";

import type { PeriodScopeSelectorTab } from "@/components/feedback/period-scope-selector-modal";
import {
  classifyUnknownError,
  listSelectableDays,
  listSelectableMonths,
  listSelectableWeeks,
  type SelectableDay,
  type SelectablePeriod,
} from "@/services";

export function usePeriodScopeSelectorOptions(initialTab: PeriodScopeSelectorTab = "day") {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<PeriodScopeSelectorTab>(initialTab);

  const [days, setDays] = useState<SelectableDay[]>([]);
  const [dayLoading, setDayLoading] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);

  const [weeks, setWeeks] = useState<SelectablePeriod[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);
  const [weekError, setWeekError] = useState<string | null>(null);

  const [months, setMonths] = useState<SelectablePeriod[]>([]);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthError, setMonthError] = useState<string | null>(null);

  const ensureDaysLoaded = useCallback(async () => {
    if (dayLoading || days.length > 0) {
      return;
    }
    setDayLoading(true);
    setDayError(null);
    try {
      setDays(await listSelectableDays());
    } catch (error) {
      setDayError(classifyUnknownError(error).message);
    } finally {
      setDayLoading(false);
    }
  }, [dayLoading, days.length]);

  const ensureWeeksLoaded = useCallback(async () => {
    if (weekLoading || weeks.length > 0) {
      return;
    }
    setWeekLoading(true);
    setWeekError(null);
    try {
      setWeeks(await listSelectableWeeks());
    } catch (error) {
      setWeekError(classifyUnknownError(error).message);
    } finally {
      setWeekLoading(false);
    }
  }, [weekLoading, weeks.length]);

  const ensureMonthsLoaded = useCallback(async () => {
    if (monthLoading || months.length > 0) {
      return;
    }
    setMonthLoading(true);
    setMonthError(null);
    try {
      setMonths(await listSelectableMonths());
    } catch (error) {
      setMonthError(classifyUnknownError(error).message);
    } finally {
      setMonthLoading(false);
    }
  }, [monthLoading, months.length]);

  const ensureTabLoaded = useCallback(
    async (tab: PeriodScopeSelectorTab) => {
      if (tab === "day") {
        await ensureDaysLoaded();
        return;
      }
      if (tab === "week") {
        await ensureWeeksLoaded();
        return;
      }
      await ensureMonthsLoaded();
    },
    [ensureDaysLoaded, ensureMonthsLoaded, ensureWeeksLoaded]
  );

  const open = useCallback(
    async (initialActiveTab: PeriodScopeSelectorTab = activeTab) => {
      setActiveTab(initialActiveTab);
      await ensureTabLoaded(initialActiveTab);
      setVisible(true);
    },
    [activeTab, ensureTabLoaded]
  );

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const onChangeTab = useCallback(
    (nextTab: PeriodScopeSelectorTab) => {
      setActiveTab(nextTab);
      void ensureTabLoaded(nextTab);
    },
    [ensureTabLoaded]
  );

  const modalProps = useMemo(
    () => ({
      visible,
      activeTab,
      onClose: close,
      onChangeTab,
      dayLoading,
      dayError,
      days,
      weekLoading,
      weekError,
      weeks,
      monthLoading,
      monthError,
      months,
    }),
    [
      activeTab,
      close,
      dayError,
      dayLoading,
      days,
      monthError,
      monthLoading,
      months,
      onChangeTab,
      visible,
      weekError,
      weekLoading,
      weeks,
    ]
  );

  return {
    activeTab,
    open,
    close,
    modalProps,
  };
}
