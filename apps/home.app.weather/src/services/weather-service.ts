const openMeteoApiUrl = 'https://api.open-meteo.com';

export const getForecast = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) => {
  const response = await fetch(
    `${openMeteoApiUrl}/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=weather_code`,
  );
  return response.json();
};
