import React from 'react';

export enum Themes {
  LIGHT = 'light',
  DARK = 'dark'
}

type ThemeStateInit = {
  isDarkMode: boolean;
  isThemeLoading: boolean;
  updateDarkMode: (isDarkMode: boolean) => void;
};

const themeContext = React.createContext({
  isDarkMode: localStorage.getItem('theme') === Themes.DARK,
  isThemeLoading: false
} as ThemeStateInit);

export default themeContext;
