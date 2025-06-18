import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import { ReduxStateProvider } from './state/redux/reduxAdapter';

// Import do sistema de design tokens
import './styles/tokens.css';
import './styles/base.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ReduxStateProvider>
        <CssBaseline />
        <App />
      </ReduxStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);
