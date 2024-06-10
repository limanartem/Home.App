import ReactDOM from 'react-dom/client';
import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container, Stack, Typography } from '@mui/material';

const App = () => (
  <Container>
    <Typography variant="h1">Public Transportation</Typography>
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
