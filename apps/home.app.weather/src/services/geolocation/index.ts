import { ReverseGeocodeClientResponse } from './api.bigdatacloud.net.types';
import { GeoJsonResponse } from './get.geojs.io.types';

if ('geolocation' in navigator) {
  console.info('geolocation is available');
} else {
  console.info('geolocation is not available');
}

const GEO_LOCATION_TIMEOUT = 5000;
const REACT_GEO_BY_IP_URL = process.env.GEO_BY_IP_URL;
const BIG_DATA_CLOUD_API_URL = process.env.BIG_DATA_CLOUD_API_URL;

const isGeolocationError = (error: GeolocationPositionError) =>
  [error.PERMISSION_DENIED, error.POSITION_UNAVAILABLE, error.TIMEOUT].includes(
    error.code as 1 | 2 | 3,
  );

const getIpBasedGeolocation = async () => {
  const response = await fetch(REACT_GEO_BY_IP_URL!);
  const data = (await response.json()) as GeoJsonResponse;
  return {
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    accuracy: data.accuracy,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null,
  };
};

const GEO_API_PARAMS = {
  enableHighAccuracy: true,
  maximumAge: Infinity,
  timeout: GEO_LOCATION_TIMEOUT,
};
export const getCurrentPosition = async () => {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Got current position');
        resolve(position);
      },
      async (error) => {
        console.error('Failed to get current position', error);
        if (!(await handleGeoPositionError(error, resolve, reject))) {
          reject(new Error('Failed to get current position'));
        }
      },
      GEO_API_PARAMS,
    );
  });
};

export const onPositionChange = (callback: (position: GeolocationPosition) => Promise<void>) => {
  const watchId = navigator.geolocation.watchPosition(
    callback,
    async (error) => {
      console.error('Failed to get current position', error);
      await handleGeoPositionError(error, callback);
    },
    GEO_API_PARAMS,
  );
  return () => navigator.geolocation.clearWatch(watchId);
};

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
    `${BIG_DATA_CLOUD_API_URL}/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
  );
  const data = (await response.json()) as ReverseGeocodeClientResponse;
  return {
    city: data.city,
    countryName: data.countryName,
    countryCode: data.countryCode,
    locality: data.locality,
  };
};

async function handleGeoPositionError(
  error: GeolocationPositionError,
  success: (value: GeolocationPosition) => Promise<void> | void,
  failure?: (reason?: Error) => Promise<void> | void,
) {
  if (isGeolocationError(error)) {
    // Fallback to use IP based geolocation
    try {
      const ipBasedGeolocation = await getIpBasedGeolocation();
      await success({
        coords: ipBasedGeolocation,
        timestamp: Date.now(),
      });
      return true;
    } catch (error2) {
      console.error('Failed to get current position using fallback method', error2);
      await failure?.(new Error('Failed to get current position using fallback method'));
    }
  }
  return false;
}
