import ReactDOM from 'react-dom/client';
import React from 'react';
import WeatherWidget from './components/WeatherWidget';

const App = () => (
  <div className="border-solid border-2 border-sky-500 m-8 inline-flex">
    <WeatherWidget />
  </div>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
);
