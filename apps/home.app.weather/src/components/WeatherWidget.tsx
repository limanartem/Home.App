import { useEffect, useState } from 'react';
import {
  PositionInfo,
  getCurrentPosition,
  getPositionInfo,
  onPositionChange,
} from '../services/geolocation';
import { Forecast, getForecast } from '../services/weather';
import assets from '../assets';

type WeatherWidgetSize = 'small' | 'medium' | 'large';

const getImageUrl = (forecast: Forecast): string | undefined =>
  assets.weatherIcons[forecast.current.icon as keyof typeof assets.weatherIcons];

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
      {forecast && (
        <div className="w-32 h-32">
          <div className="grid grid-cols-3 grid-rows-2 gap-1 relative">
            <div className="col-span-3">
              <h1>{locationInfo?.city ?? locationInfo?.locality}</h1>
            </div>
            <div className="col-span-3">{forecast.current.temperature}</div>
            <div className="absolute top-0 left-0 -z-10">
              <img src={getImageUrl(forecast)} alt={forecast.current.description} />
            </div>

            <div>{forecast.day.lowestTemperature}</div>
            <div>{forecast.day.lowestTemperature}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
