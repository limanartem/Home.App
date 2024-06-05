import { useEffect, useState } from 'react';
import {
  PositionInfo,
  getCurrentPosition,
  getPositionInfo,
  onPositionChange,
} from '../services/geolocation';
import { Forecast, getForecast } from '../services/weather';

type WeatherWidgetSize = 'small' | 'medium' | 'large';

export const WeatherWidget = ({ size = 'medium' }: { size?: WeatherWidgetSize }) => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [locationInfo, setLocationInfo] = useState<PositionInfo | null>(null);

  const loadForecast = async () => {
    try {
      const position = await getCurrentPosition();
      setPosition(position);

      const clearOnPositionChange = onPositionChange(async (position) => {
        const forecast = await getForecast(position.coords);
        const locationInfo = await getPositionInfo(position.coords);

        setForecast(forecast);
        setLocationInfo(locationInfo);
        setPosition(position);
      });

      const forecast = await getForecast(position.coords);
      const locationInfo = await getPositionInfo(position.coords);

      setForecast(forecast);
      setLocationInfo(locationInfo);

      return () => clearOnPositionChange();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <div>
      <h1>{size} Weather Widget</h1>
      <h2>{JSON.stringify(new Date())}</h2>

      {forecast && (
        <div>

          <h2>
            {JSON.stringify({
              coords: {
                latitude: position?.coords.latitude,
                longitude: position?.coords.longitude,
                accuracy: position?.coords.accuracy,
              },
            })}
          </h2>
          <h2>{JSON.stringify(locationInfo)}</h2>
          <h3>Current weather</h3>
          <p>{forecast.current.temperature}</p>
          <p>{forecast.current.description}</p>
          <img src={`public/assets/weather-icons/${forecast.current.icon}`} alt={forecast.current.description} />
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
