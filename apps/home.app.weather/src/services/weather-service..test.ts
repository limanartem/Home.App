import { Agent, Interceptable, MockAgent, setGlobalDispatcher } from 'undici';
import { getForecast } from './weather-service';
import { mocks } from '../test-utils/mocks';

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

  it('should get a forecast', async () => {
    const latitude = 50.78;
    const longitude = 6.1;

    mockPool
      .intercept({ path: `/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=weather_code`, method: 'GET' })
      .reply(200, () => mocks.openMeteo.forecast)
      .persist();

    const forecast = await getForecast({
      latitude,
      longitude,
    });
    expect(forecast).toMatchObject({
      latitude,
      longitude,
      current: expect.anything(),
      hourly: expect.anything(),
    });
  });
});
