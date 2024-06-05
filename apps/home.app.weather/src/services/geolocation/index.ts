import { ReverseGeocodeClientResponse } from './types';

if ('geolocation' in navigator) {
  console.info('geolocation is available');
} else {
  console.info('geolocation is not available');
}

export const getCurrentPosition = async () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('Got current position');
      resolve(position);
    }, (error) => {
      console.error('Failed to get current position', error);
      reject();
    }, { enableHighAccuracy: false, maximumAge: Infinity });
  });
};

export const onPositionChange = (callback: (position: GeolocationPosition) => void) => {
  const watchId = navigator.geolocation.watchPosition(callback, undefined, { enableHighAccuracy: false });
  return () => navigator.geolocation.clearWatch(watchId);
}

export type PositionInfo = {
  city?: string;
  countryName?: string;
  countryCode?: string;
  locality: string;
};

export const getPositionInfo = async ({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}): Promise<PositionInfo> => {
  const response = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );
  const data = (await response.json()) as ReverseGeocodeClientResponse;
  return {
    city: data.city,
    countryName: data.countryName,
    countryCode: data.countryCode,
    locality: data.locality,
  };
};
