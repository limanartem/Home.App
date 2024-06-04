export interface ForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: CurrentUnits;
  current: Current;
  hourly_units: HourlyUnits;
  hourly: Hourly;
}

interface Hourly {
  time: string[];
  weather_code: number[];
  temperature_2m: number[];
}

interface HourlyUnits {
  time: string;
  weather_code: string;
  temperature_2m: string;
}

interface Current {
  time: string;
  interval: number;
  weather_code: number;
  temperature_2m: number;
}

interface CurrentUnits {
  time: string;
  interval: string;
  weather_code: string;
  temperature_2m: string;
}