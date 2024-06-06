import { useEffect, useState } from 'react';
import {
  PositionInfo,
  getCurrentPosition,
  getPositionInfo,
  onPositionChange,
} from '../services/geolocation';
import { Forecast, getForecast } from '../services/weather';
import assets from '../assets';
import { CardContent, Paper, Typography, Stack, Box, Divider } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import StraightIcon from '@mui/icons-material/Straight';
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
    <>
      {forecast && (
        <Paper style={{ width: 150, height: 150, padding: 5 }}>
          <Stack direction="column" spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Stack direction="column">
                <Typography variant="subtitle1" fontWeight={500} alignContent="center">
                  {locationInfo?.city ?? locationInfo?.locality}
                </Typography>
                <Typography variant="body1" fontSize={18}>
                  {forecast.current.temperature}
                </Typography>
              </Stack>
              <Stack direction="column" alignItems="center">
                <img
                  src={getImageUrl(forecast)}
                  alt={forecast.current.description}
                  style={{ width: 40 }}
                />
                <Typography variant="body1" fontSize={10} alignContent="center">
                  {forecast.current.description}
                </Typography>
              </Stack>
            </Stack>
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
          </Stack>
        </Paper>
      )}
    </>
  );
};

export default WeatherWidget;
