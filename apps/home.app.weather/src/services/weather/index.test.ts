import { Agent, Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { Forecast, getForecast } from '.';
import { mocks } from '../../test-utils/mocks';

describe('weather-service', () => {
  const openMeteoApiUrl = 'https://api.open-meteo.com';

  let mockAgent: MockAgent;
  let mockPool: Interceptable;

  beforeEach(() => {
    mockAgent = new MockAgent();
    mockPool = mockAgent.get(openMeteoApiUrl!);

    (global as any).setMockedFetchGlobalDispatcher(mockAgent);
    mockAgent.disableNetConnect();

    jest.resetAllMocks();
  });

  afterEach(async () => {
    await mockAgent.close();
    setGlobalDispatcher(new Agent());
  });

  describe('should get a forecast', () => {
    const latitude = 50.78;
    const longitude = 6.1;
    let forecast: Forecast;

    beforeEach(async () => {
      mockPool
        .intercept({
          path: `/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code,temperature_2m&current=weather_code,temperature_2m&forecast_days=3`,
          method: 'GET',
        })
        .reply(200, () => mocks.openMeteo.forecast)
        .persist();

      forecast = await getForecast({
        latitude,
        longitude,
      });
    });

    it('should return a forecast', () => {
      expect(forecast).toMatchObject({
        latitude,
        longitude,
        current: expect.anything(),
        hourly: expect.anything(),
      });
    });

    it('should return a current forecast', () => {
      expect(forecast.current).toMatchObject({
        time: expect.any(Date),
        temperature: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
      });
    });

    it('should return an hourly forecast', () => {
      expect(forecast.hourly).toBeDefined();
      forecast.hourly.forEach((hourly) => {
        expect(hourly).toMatchObject({
          time: expect.any(Date),
          temperature: expect.any(String),
          description: expect.any(String),
          icon: expect.any(String),
        });
      });
    });

    it('should map weather code to weather description and icon', () => {
      expect(forecast.current).toMatchObject({
        description: 'Cloudy',
        icon: '03d@2x.png',
      });
      const nightTimeIndex = mocks.openMeteo.forecast.hourly.time.indexOf('2024-06-03T18:00');
      const nightForecast = forecast.hourly[nightTimeIndex];
      expect(nightForecast).toMatchObject({
        description: 'Mainly Clear',
        icon: '01n@2x.png',
      });
    });

    it('should map temperature units', () => {
      expect(forecast.current.temperatureString).toMatch(/\d+(\.\d+)?°C/);
      forecast.hourly.forEach((hourly) => {
        expect(hourly.temperatureString).toMatch(/\d+(\.\d+)?°C/);
      });
    });

    it("should return day's lowest and highest temperature", () => {
      expect(forecast.day).toMatchObject({
        lowestTemperature: '9.2°C',
        highestTemperature: '15.8°C',
      });
    });
  });
});
