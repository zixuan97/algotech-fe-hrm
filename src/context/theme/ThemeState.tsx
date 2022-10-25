import React from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import ThemeContext, { Themes } from './themeContext';

/**
 * Lightweight context used to store state
 */
const ThemeState = ({ children }: React.PropsWithChildren) => {
  const { switcher, status, themes } = useThemeSwitcher();

  const storedTheme = localStorage.getItem('theme');
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    !!storedTheme && storedTheme === Themes.DARK
  );

  const isThemeLoading = status === 'loading';

  const updateDarkMode = React.useCallback(
    (isDarkMode: boolean) => {
      setIsDarkMode(isDarkMode);
      const updatedTheme = isDarkMode ? Themes.DARK : Themes.LIGHT;
      localStorage.setItem('theme', updatedTheme);
      switcher({ theme: themes[updatedTheme] });
    },
    [themes, switcher]
  );

  React.useEffect(() => {
    if (storedTheme && storedTheme in Themes) {
      setIsDarkMode(storedTheme === Themes.DARK);
      switcher({ theme: themes[storedTheme] });
    }
  }, [storedTheme, switcher, themes]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        isThemeLoading,
        updateDarkMode
      }}
    >
      {!isThemeLoading && children}
    </ThemeContext.Provider>
  );
};

export default ThemeState;
