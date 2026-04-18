let selectedDayDateInSession: string | null = null;

export function getSessionSelectedDayDate(): string | null {
  return selectedDayDateInSession;
}

export function setSessionSelectedDayDate(value: string | null): void {
  selectedDayDateInSession = value;
}
