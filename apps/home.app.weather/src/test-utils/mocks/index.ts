import openMeteoResponse from './api.open-meteo.com.json';
import reverseGeocodeClientResponse from './api.bigdatacloud.net.json';
import geojsResponse from './get.geojs.io.json';

export const mocks = {
  openMeteo: {
    forecast: openMeteoResponse,
  },
  bigDataCloud: {
    reverseGeocodeClient: reverseGeocodeClientResponse,
  },
  geojsio: {
    geoJson: geojsResponse,
  },
};
