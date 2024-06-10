import '@testing-library/jest-dom';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';
import { getPositionInfo, onPositionChange } from '../services/geolocation';
import { getForecast } from '../services/weather';

jest.mock('../services/geolocation', () => ({
  getPositionInfo: jest.fn(() => Promise.resolve({ locality: 'Test' })),
  onPositionChange: jest.fn(() => jest.fn()),
}));

jest.mock('../services/weather', () => ({
  getForecast: jest.fn(),
}));

describe('WeatherWidget', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('should render a weather widget', () => {
    it('renders a medium weather widget by default', () => {
      render(<WeatherWidget />);
      expect(screen.getByTestId('medium-Weather-Widget')).toBeInTheDocument();
    });

    it('renders a small weather widget', () => {
      render(<WeatherWidget size="small" />);
      expect(screen.getByTestId('small-Weather-Widget')).toBeInTheDocument();
    });

    it('renders a large weather widget', () => {
      render(<WeatherWidget size="large" />);
      expect(screen.getByTestId('large-Weather-Widget')).toBeInTheDocument();
    });
  });

  describe('should use current geolocation for forecast', () => {
    it('fetches the weather for the current location', async () => {
      const coords = { latitude: 50.78, longitude: 6.1 };

      (onPositionChange as jest.Mock).mockImplementation(
        (callback: (position: GeolocationPosition) => void) => {
          callback({ coords } as GeolocationPosition);
          return jest.fn();
        },
      );
      (getForecast as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ...coords,
          current: {
            time: new Date(),
            temperature: '10°C',
            description: 'Cloudy',
            icon: 'cloudy',
          },
          hourly: [
            {
              time: new Date(),
              temperature: '10°C',
              description: 'Cloudy',
              icon: 'cloudy',
            },
          ],
          day: {
            highestTemperature: '20°C',
            lowestTemperature: '5°C',
          },
        }),
      );
      (getPositionInfo as jest.Mock).mockImplementation(() =>
        Promise.resolve({ locality: 'Test' }),
      );

      render(<WeatherWidget />);

      await waitFor(() => {
        expect(onPositionChange).toHaveBeenCalled();
        expect(getForecast).toHaveBeenCalledWith(expect.objectContaining(coords));
        expect(getPositionInfo).toHaveBeenCalledWith(coords);
      });
    });
  });

  describe('should allow to specify a location', () => {
    it('fetches the weather for the specified location', async () => {
      const coords = { latitude: 49.8419, longitude: 24.0315 };

      (getForecast as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ...coords,
          current: {
            time: new Date(),
            temperature: '10°C',
            description: 'Cloudy',
            icon: 'cloudy',
          },
          hourly: [
            {
              time: new Date(),
              temperature: '10°C',
              description: 'Cloudy',
              icon: 'cloudy',
            },
          ],
          day: {
            highestTemperature: '20°C',
            lowestTemperature: '5°C',
          },
        }),
      );
      (getPositionInfo as jest.Mock).mockImplementation(() =>
        Promise.resolve({ locality: 'Test' }),
      );

      render(<WeatherWidget location={{ ...coords }} />);

      await waitFor(() => {
        expect(onPositionChange).not.toHaveBeenCalled();
        expect(getForecast).toHaveBeenCalledWith(expect.objectContaining(coords));
        expect(getPositionInfo).toHaveBeenCalledWith(coords);
      });
    });
  });
});
