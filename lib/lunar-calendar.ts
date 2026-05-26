import solarLunar from "solarlunar";

export type LunarDate = {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
};

export function solarToLunar(date: Date): LunarDate {
  const result = solarLunar.solar2lunar(date.getFullYear(), date.getMonth() + 1, date.getDate());
  return {
    year: result.lYear,
    month: result.lMonth,
    day: result.lDay,
    isLeapMonth: Boolean(result.isLeap),
  };
}

export function lunarToSolar(year: number, lunarMonth: number, lunarDay: number, isLeapMonth = false): Date {
  const result = solarLunar.lunar2solar(year, lunarMonth, lunarDay, isLeapMonth);
  return new Date(Date.UTC(result.cYear, result.cMonth - 1, result.cDay, 0, 0, 0));
}

export function formatLunarShort(date: Date): string {
  const lunar = solarToLunar(date);
  return `${lunar.day}/${lunar.month}`;
}
