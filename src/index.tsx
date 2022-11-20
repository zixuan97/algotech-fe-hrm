import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import React from 'react';

const themes = {
  dark: `${process.env.PUBLIC_URL}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL}/light-theme.css`
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeSwitcherProvider
      themeMap={themes}
      defaultTheme={localStorage.getItem('theme') ?? 'light'}
    >
      <App />
    </ThemeSwitcherProvider>
  </React.StrictMode>
);
