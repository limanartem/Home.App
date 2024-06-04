import { ForecastResponse } from './types';
import weatherDescriptions from './descriptions';

const openMeteoApiUrl = 'https://api.open-meteo.com';

type ForecastData = {
  time: Date;
  temperature: string;
  description: string;
  icon: string;
};

export interface Forecast {
  latitude: number;
  longitude: number;
  current: ForecastData;
  hourly: ForecastData[];
}

export const getForecast = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<Forecast> => {
  const response = await fetch(
    `${openMeteoApiUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code,temperature_2m&current=weather_code,temperature_2m`,
  );
  const data = (await response.json()) as ForecastResponse;
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    current: {
      ...getWeatherDescription(data.current.weather_code, data.current.time),
      time: new Date(data.current.time),
      temperature: `${data.current.temperature_2m}${data.current_units.temperature_2m}`,
    },
    hourly: data.hourly.time.map((time: string, index: number) => ({
      ...getWeatherDescription(data.hourly.weather_code[index], time),
      time: new Date(time),
      weatherCode: data.hourly.weather_code[index],
      temperature: `${data.hourly.temperature_2m[index]}${data.current_units.temperature_2m}`,
    })),
  };
};
function getWeatherDescription(weather_code: number, time: string) {
  const weatherProp = weather_code.toString() as keyof typeof weatherDescriptions;
  const hour = new Date(time).getHours();
  const isDaytime = hour >= 6 && hour < 18;

  const description = isDaytime
    ? weatherDescriptions[weatherProp].day.description
    : weatherDescriptions[weatherProp].night.description;

  const icon = isDaytime
    ? weatherDescriptions[weatherProp].day.image
    : weatherDescriptions[weatherProp].night.image;

  return {
    description,
    icon,
  };
}
