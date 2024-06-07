import { useEffect, useState } from 'react';
import {
  PositionInfo,
  getPositionInfo,
  onPositionChange,
} from '../services/geolocation';
import { Forecast, ForecastData, getForecast } from '../services/weather';
import assets from '../assets';
import { Paper, Typography, Stack, Box, Divider } from '@mui/material';
import StraightIcon from '@mui/icons-material/Straight';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import React from 'react';

const TemperatureChart = React.lazy(() => import('./TemperatureChart'));

type WeatherWidgetSize = 'small' | 'medium' | 'large';

const getImageUrl = (forecastData: ForecastData): string | undefined =>
  assets.weatherIcons[forecastData.icon as keyof typeof assets.weatherIcons];

function getNextHoursForecast(forecast: Forecast, hours: number = 3) {
  const currentHour = new Date();
  const nextHours = forecast.hourly.filter((hourly) => hourly.time > currentHour);
  return nextHours.slice(0, hours);
}

export const WeatherWidget = ({ size = 'medium' }: { size?: WeatherWidgetSize }) => {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [locationInfo, setLocationInfo] = useState<PositionInfo | null>(null);

  const baseSize = 165;
  const widgetWidth = size == 'small' ? baseSize : size == 'medium' ? 2 * 165 : 3 * 165;
  const widgetHeight = size == 'large' ? 2 * 165 : 165;

  const loadForecast = async () => {
    try {
      const clearOnPositionChange = onPositionChange(async (position) => {
        const forecast = await getForecast(position.coords);
        const locationInfo = await getPositionInfo(position.coords);

        setForecast(forecast);
        setLocationInfo(locationInfo);
      });

      return () => clearOnPositionChange();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);

  return (
    <>
      {forecast && (
        <Paper
          style={{
            width: widgetWidth,
            height: widgetHeight,
            padding: 5,
          }}
        >
          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="column">
                <Typography variant="subtitle1" fontWeight={500} alignContent="center">
                  {locationInfo?.city ?? locationInfo?.locality}
                </Typography>
                <Typography variant="body1" fontSize={18}>
                  <DeviceThermostatIcon fontSize="small" htmlColor="skyblue" />
                  {forecast.current.temperatureString}
                </Typography>
                {size == 'large' && (
                  <>
                    <Stack direction="row" spacing={1} justifyContent="space-between">
                      <Box>
                        <Typography variant="body1" fontSize={12} color="skyblue">
                          <StraightIcon sx={{ transform: 'rotate(180deg)', fontSize: 14 }} />
                          {forecast.day.lowestTemperature}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body1" fontSize={12} color="orange">
                          <StraightIcon sx={{ fontSize: 14 }} />
                          {forecast.day.highestTemperature}
                        </Typography>
                      </Box>
                    </Stack>
                  </>
                )}
              </Stack>
              <Stack direction="column" alignItems="center">
                <img
                  src={getImageUrl(forecast.current)}
                  alt={forecast.current.description}
                  title={forecast.current.description}
                  style={{ width: 40 }}
                />
                <Typography variant="body1" fontSize={10} alignContent="center">
                  {forecast.current.description}
                </Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={1} justifyContent="space-between">
              {getNextHoursForecast(forecast, size == 'small' ? 3 : 6).map((hourly, index) => (
                <Stack key={index} direction="column" alignItems="center">
                  <Typography variant="body1" fontSize={12}>
                    {new Date(hourly.time).getHours()}:00
                  </Typography>
                  <img
                    src={getImageUrl(hourly)}
                    alt={hourly.description}
                    style={{ width: 20 }}
                    title={hourly.description}
                  />
                  <Typography variant="body1" fontSize={12}>
                    {hourly.temperatureString}
                  </Typography>
                </Stack>
              ))}
            </Stack>
            {size !== 'large' && (
              <>
                <Divider />
                <Stack direction="row" spacing={1} justifyContent="space-between">
                  <Box>
                    <Typography variant="body1" fontSize={12} color="skyblue">
                      <StraightIcon sx={{ transform: 'rotate(180deg)', fontSize: 14 }} />
                      {forecast.day.lowestTemperature}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1" fontSize={12} color="orange">
                      <StraightIcon sx={{ fontSize: 14 }} />
                      {forecast.day.highestTemperature}
                    </Typography>
                  </Box>
                </Stack>
              </>
            )}
            {size === 'large' && (
              <>
                <Divider />
                <TemperatureChart forecast={forecast.hourly} />
              </>
            )}
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default WeatherWidget;
