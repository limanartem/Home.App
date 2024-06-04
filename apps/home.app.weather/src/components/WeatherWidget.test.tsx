import '@testing-library/jest-dom';
import { render, screen, cleanup, within, fireEvent, waitFor } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';
import { getCurrentPosition } from '../services/geolocation';
import { getForecast } from '../services/weather';

jest.mock('../services/geolocation', () => ({
  getCurrentPosition: jest.fn(() => Promise.resolve({ coords: { latitude: 0, longitude: 0 } })),
}));

jest.mock('../services/weather', () => ({
  getForecast: jest.fn(),
}));

describe('WeatherWidget', () => {
  afterEach(() => {
    cleanup();
    jest.restoreAllMocks();
  });

  describe('should render a weather widget', () => {
    it('renders a medium weather widget by default', () => {
      render(<WeatherWidget />);
      expect(screen.getByText('medium Weather Widget')).toBeInTheDocument();
    });

    it('renders a small weather widget', () => {
      render(<WeatherWidget size="small" />);
      expect(screen.getByText('small Weather Widget')).toBeInTheDocument();
    });

    it('renders a large weather widget', () => {
      render(<WeatherWidget size="large" />);
      expect(screen.getByText('large Weather Widget')).toBeInTheDocument();
    });
  });

  describe('should use geolocation for forecast', () => {
    it('fetches the weather for the current location', async () => {
      const coords = { latitude: 50.78, longitude: 6.1 };

      (getCurrentPosition as jest.Mock).mockImplementation(() => Promise.resolve({ coords }));
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
        }),
      );

      render(<WeatherWidget />);

      await waitFor(() => {
        expect(getCurrentPosition).toHaveBeenCalled();
        expect(getForecast).toHaveBeenCalled();
        expect(getForecast).toHaveBeenCalledWith(expect.objectContaining(coords));
      });
    });
  });
});
