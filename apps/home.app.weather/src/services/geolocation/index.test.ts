import { getCurrentPosition, getPositionInfo, onPositionChange } from '.';
import { mocks } from '../../test-utils/mocks';
import { Agent, Interceptable, MockAgent, setGlobalDispatcher } from 'undici';

describe('geolocation', () => {
  let mockAgent: MockAgent;
  let mockPool: Interceptable;

  beforeEach(() => {
    mockAgent = new MockAgent();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).setMockedFetchGlobalDispatcher(mockAgent);
    mockAgent.disableNetConnect();

    jest.resetAllMocks();
  });

  afterEach(async () => {
    await mockAgent.close();
    setGlobalDispatcher(new Agent());
  });

  describe('getCurrentPosition', () => {
    beforeEach(() => {
      mockPool = mockAgent.get('https://get.geojs.io');
    });

    it.each([
      [1, 'permission was denied'],
      [2, 'position was not available'],
      [3, 'timeout'],
    ])(
      'should fallback to IP based geo location if getCurrentPosition errors out with code %s (%s)',
      async (code) => {
        jest
          .spyOn(navigator.geolocation, 'getCurrentPosition')
          .mockImplementation((successCallback, errorCallback) => {
            errorCallback?.({
              code,
              message: '',
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            });
          });
        mockPool
          .intercept({
            path: '/v1/ip/geo.json',
            method: 'GET',
          })
          .reply(200, () => mocks.geojsio.geoJson)
          .persist();

        const position = await getCurrentPosition();

        expect(position).toMatchObject({
          coords: {
            longitude: 8.4671,
            accuracy: 20,
            latitude: 49.5068,
          },
        });
      },
    );

    it('should not fallback to geo ip in case of other errors', async () => {
      jest
        .spyOn(navigator.geolocation, 'getCurrentPosition')
        .mockImplementation((successCallback, errorCallback) => {
          errorCallback?.({
            code: 4,
            message: '',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          });
        });

      mockPool.intercept({
        path: '/v1/ip/geo.json',
        method: 'GET',
      });

      expect(async () => await getCurrentPosition()).rejects.toThrow();
    });
  });

  describe('onPositionChange', () => {
    beforeEach(() => {
      mockPool = mockAgent.get('https://get.geojs.io');
    });

    it.each([
      [1, 'permission was denied'],
      [2, 'position was not available'],
      [3, 'timeout'],
    ])(
      'should fallback to IP based geo location if watchPosition errors with code is %s (%s)',
      async (code) => {
        jest
          .spyOn(navigator.geolocation, 'watchPosition')
          .mockImplementation((successCallback, errorCallback) => {
            errorCallback?.({
              code,
              message: '',
              PERMISSION_DENIED: 1,
              POSITION_UNAVAILABLE: 2,
              TIMEOUT: 3,
            });
            return 1;
          });
        mockPool
          .intercept({
            path: '/v1/ip/geo.json',
            method: 'GET',
          })
          .reply(200, () => mocks.geojsio.geoJson)
          .persist();

        const callback = jest.fn();

        onPositionChange(callback);

        await new Promise((resolve, reject) =>
          setTimeout(() => {
            try {
              expect(callback).toHaveBeenCalledWith(
                expect.objectContaining({
                  coords: expect.objectContaining({
                    longitude: 8.4671,
                    accuracy: 20,
                    latitude: 49.5068,
                  }),
                }),
              );
              resolve(null);
            } catch (error) {
              reject(error);
            }
          }, 0),
        );
      },
    );

    it('should not fallback to geo ip in case of other errors', async () => {
      jest
        .spyOn(navigator.geolocation, 'watchPosition')
        .mockImplementation((successCallback, errorCallback) => {
          errorCallback?.({
            code: 4,
            message: '',
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3,
          });
          return 1;
        });

      mockPool
        .intercept({
          path: '/v1/ip/geo.json',
          method: 'GET',
        })
        .reply(200, () => mocks.geojsio.geoJson)
        .persist();

      const callback = jest.fn();

      onPositionChange(callback);

      await new Promise((resolve, reject) =>
        setTimeout(() => {
          try {
            expect(callback).not.toHaveBeenCalled();
            resolve(null);
          } catch (error) {
            reject(error);
          }
        }, 100),
      );
    });
  });

  describe('getPositionInfo', () => {
    beforeEach(() => {
      mockPool = mockAgent.get('https://api.bigdatacloud.net');
    });

    it('should return bigdatacloud geo position info', async () => {
      const latitude = 50.78;
      const longitude = 6.1;

      mockPool
        .intercept({
          path: `/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
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
