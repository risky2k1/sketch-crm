declare module "solarlunar" {
  type SolarToLunarResult = {
    lYear: number;
    lMonth: number;
    lDay: number;
    isLeap: boolean;
  };

  type LunarToSolarResult = {
    cYear: number;
    cMonth: number;
    cDay: number;
  };

  const api: {
    solar2lunar: (year: number, month: number, day: number) => SolarToLunarResult;
    lunar2solar: (year: number, month: number, day: number, isLeapMonth?: boolean) => LunarToSolarResult;
  };

  export default api;
}
