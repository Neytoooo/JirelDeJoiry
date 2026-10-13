export interface MonthData {
  name: string;
  daysCount: number;
  startDay: number; // 0: Sunday, 1: Monday, etc.
}

export const BOOKING_MONTHS: MonthData[] = [
  { name: 'AOÛT 2026', daysCount: 31, startDay: 6 },
  { name: 'SEPTEMBRE 2026', daysCount: 30, startDay: 2 },
  { name: 'OCTOBRE 2026', daysCount: 31, startDay: 4 },
];

export const DEFAULT_TIME_SLOTS = [
  '10h00',
  '11h00',
  '12h00',
  '13h00',
  '14h00',
  '15h00',
];
