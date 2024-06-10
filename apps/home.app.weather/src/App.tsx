import ReactDOM from 'react-dom/client';
import React from 'react';
import WeatherWidget from './components/WeatherWidget';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, Stack } from '@mui/material';

const App = () => (
  <Container>
    <Stack spacing={2}>
      <WeatherWidget size="small" />
      <WeatherWidget size="medium" location={{ latitude: 49.8419, longitude: 24.0315 }} />
      <WeatherWidget size="large" />
    </Stack>
  </Container>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
