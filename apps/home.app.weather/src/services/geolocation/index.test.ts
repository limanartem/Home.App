import { getPositionInfo } from '.';
import { mocks } from '../../test-utils/mocks';
import { Agent, Interceptable, MockAgent, setGlobalDispatcher } from 'undici';

const bigDataCloudUrl = 'https://api.bigdatacloud.net';

describe('geolocation', () => {
  describe('getPositionInfo', () => {
    let mockAgent: MockAgent;
    let mockPool: Interceptable;

    beforeEach(() => {
      mockAgent = new MockAgent();
      mockPool = mockAgent.get(bigDataCloudUrl!);

      (global as any).setMockedFetchGlobalDispatcher(mockAgent);
      mockAgent.disableNetConnect();

      jest.resetAllMocks();
    });

    afterEach(async () => {
      await mockAgent.close();
      setGlobalDispatcher(new Agent());
    });

    it('should return bigdatacloud geo position info', async () => {
      const latitude = 50.78;
      const longitude = 6.1;

      mockPool
        .intercept({
          path: `/data/reverse-geocode-client?latitude=${latitude}&longitude=,${longitude}&localityLanguage=en`,
          method: 'GET',
        })
        .reply(200, () => mocks.bigDataCloud.reverseGeocodeClient)
        .persist();

      const positionInfo = await getPositionInfo({
        latitude,
        longitude,
      });

      expect(positionInfo).toMatchObject({
        countryName: 'Germany',
        countryCode: 'DE',
        city: 'Aachen',
        locality: 'Aachen',
      });
    });
  });
});
