import { useEffect } from 'react';
import { getCurrentPosition } from '../services/geolocation';
import { getForecast } from '../services/weather';

type WeatherWidgetSize = 'small' | 'medium' | 'large';

export const WeatherWidget = ({ size = 'medium' }: { size?: WeatherWidgetSize }) => {
  const loadForecast = async () => {
    const position = await getCurrentPosition();
    const forecast = await getForecast(position.coords);
  };

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <div>
      <h1>{size} Weather Widget</h1>
    </div>
  );
};

export default WeatherWidget;
