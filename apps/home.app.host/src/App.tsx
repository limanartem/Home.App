import React from 'react';
import ReactDOM from 'react-dom/client';
import WeatherWidgetType from '../@mf-types/weather/_types/WeatherWidget';

import './index.scss';

// @ts-expect-error
const WeatherWidget = React.lazy(() =>import('weather/WeatherWidget')) as unknown as typeof WeatherWidgetType;

const App = () => (
  <>
    Hosting app
    <WeatherWidget />
  </>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);
