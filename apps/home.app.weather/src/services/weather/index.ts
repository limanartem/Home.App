import { ForecastResponse } from './types';
import weatherDescriptions from './descriptions';

const openMeteoApiUrl = process.env.OPEN_METEO_API_URL;

export type ForecastData = {
  time: Date;
  temperatureString: string;
  temperature: number;
  description: string;
  icon: string;
};

export interface Forecast {
  latitude: number;
  longitude: number;
  current: ForecastData;
  hourly: ForecastData[];
  day: {
    lowestTemperature: string;
    highestTemperature: string;
  };
}

/**
 * Retrieves the weather forecast for a given latitude and longitude.
 * @param {Object} options - The latitude and longitude options.
 * @param {number} options.latitude - The latitude coordinate.
 * @param {number} options.longitude - The longitude coordinate.
 * @returns {Promise<Forecast>} The weather forecast.
 */
export const getForecast = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<Forecast> => {
  const response = await fetch(
    `${openMeteoApiUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code,temperature_2m&current=weather_code,temperature_2m&forecast_days=3`,
  );
  const data = (await response.json()) as ForecastResponse;
  return {
    latitude: data.latitude,
    longitude: data.longitude,
    day: {
      ...getHighLowTemperatures(
        data.hourly.temperature_2m.slice(0, 23),
        data.current_units.temperature_2m,
      ),
    },
    current: {
      ...getWeatherDescription(data.current.weather_code, data.current.time),
      time: new Date(data.current.time),
      temperatureString: `${data.current.temperature_2m}${data.current_units.temperature_2m}`,
      temperature: data.current.temperature_2m,
    },
    hourly: data.hourly.time.map((time: string, index: number) => ({
      ...getWeatherDescription(data.hourly.weather_code[index], time),
      time: new Date(time),
      weatherCode: data.hourly.weather_code[index],
      temperatureString: `${data.hourly.temperature_2m[index]}${data.current_units.temperature_2m}`,
      temperature: data.hourly.temperature_2m[index],
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

function getHighLowTemperatures(temperatures: number[], unit: string) {
  const lowestTemperature = Math.min(...temperatures);
  const highestTemperature = Math.max(...temperatures);
  return {
    lowestTemperature: `${lowestTemperature}${unit}`,
    highestTemperature: `${highestTemperature}${unit}`,
  };
}
