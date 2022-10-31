import React from 'react';
import themeContext from 'src/context/theme/themeContext';

/**
 * Selects class name based on which theme is currently employed.
 *
 * Prerequisite: the class name being supplied must have a light and dark version in this format:
 * e.g. if the class name is btn-grp, then there must also exist a btn-grp-light and btn-grp-dark class in the same CSS file.
 *
 * @param baseClassName the base class name to be supplied
 */
export const useThemedClassName = (baseClassName: string): string => {
  const { isDarkMode } = React.useContext(themeContext);
  return `${baseClassName}-${isDarkMode ? 'dark' : 'light'}`;
};
