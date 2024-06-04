import '@testing-library/jest-dom';
import { render, screen, cleanup, within, fireEvent, waitFor } from '@testing-library/react';
import WeatherWidget from './WeatherWidget';

describe('WeatherWidget', () => {
  afterEach(cleanup);

  it('renders a medium weather widget by default', () => {
    render(<WeatherWidget />);
    expect(screen.getByText('medium Weather Widget')).toBeInTheDocument();
  });

  it('renders a small weather widget', () => {
    render(<WeatherWidget size='small' />);
    expect(screen.getByText('small Weather Widget')).toBeInTheDocument();
  });

  it('renders a large weather widget', () => {
    render(<WeatherWidget size='large' />);
    expect(screen.getByText('large Weather Widget')).toBeInTheDocument();
  });
});