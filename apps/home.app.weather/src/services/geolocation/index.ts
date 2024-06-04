import { ReverseGeocodeClientResponse } from './types';

if ('geolocation' in navigator) {
  console.info('geolocation is available');
} else {
  console.info('geolocation is not available');
}

export const getCurrentPosition = async () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

export const getPositionInfo = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<{
  city?: string;
  countryName?: string;
  countryCode?: string;
  locality: string;
}> => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=,${longitude}&localityLanguage=en`,
  );
  const data = (await response.json()) as ReverseGeocodeClientResponse;
  return {
    city: data.city,
    countryName: data.countryName,
    countryCode: data.countryCode,
    locality: data.locality,
  };
};
