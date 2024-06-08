const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

// @ts-expect-error geolocation is marked as readonly, but we need to mock it
global.navigator.geolocation = mockGeolocation;

process.env.GEO_BY_IP_URL = 'https://get.geojs.io/v1/ip/geo.json';
process.env.OPEN_METEO_API_URL = 'https://api.open-meteo.com';
process.env.BIG_DATA_CLOUD_API_URL = 'https://api.bigdatacloud.net';
