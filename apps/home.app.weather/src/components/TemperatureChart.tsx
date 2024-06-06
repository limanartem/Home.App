import {
  LineChart,
  MarkElement,
  MarkElementProps,
  LinePlot,
  MarkPlot,
  AreaPlot,
} from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';

import { ForecastData } from 'src/services/weather';
import assets from '../assets';
import { BarPlot, ChartsXAxis, ChartsYAxis } from '@mui/x-charts';
import { Box, Stack } from '@mui/material';

const getImageUrl = (icon: string): string | undefined =>
  assets.weatherIcons[icon as keyof typeof assets.weatherIcons];

function getFutureTemps(forecast: ForecastData[]) {
  const currentHour = new Date();
  // Format current date as following: Sun 10
  const nextHours = forecast.filter(
    (hourly, index) => hourly.time > currentHour && index % 4 === 0,
  );

  return {
    values: nextHours.map((hourly) => hourly.temperature),
    icons: nextHours.map((hourly) => hourly.icon),
    labels: nextHours.map((hourly) =>
      hourly.time.toLocaleString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    ),
  };
}

export default function TemperatureChart({ forecast }: { forecast: ForecastData[] }) {
  const data = getFutureTemps(forecast);
  const iconsWidth = (3 * 165 - 32) / data.icons.length;
  return (
    <Box>
      <Stack direction="row" spacing={0} width={3 * 165 - 30} paddingLeft={4}>
        {data.icons.map((icon, index) => (
          <img src={getImageUrl(icon)} alt={icon} width={iconsWidth} />
        ))}
      </Stack>
      <ChartContainer
        width={3 * 165}
        height={1 * 150}
        margin={{ top: 10, right: 0, left: 30 }}
        series={[
          { type: 'bar', data: data.values, label: '°C' },
          { type: 'line', data: data.values, label: '°C', curve: 'linear', area: true },
        ]}
        xAxis={[{ scaleType: 'band', data: data.labels }]}
        yAxis={[
          {
            scaleType: 'linear',
            //min: Math.min(...data.values) - 5,
            max: Math.max(...data.values) + 5,
          },
        ]}
      >
        <AreaPlot />
        <ChartsXAxis />
        <MarkPlot />
        <ChartsYAxis />
      </ChartContainer>
    </Box>
  );
}
