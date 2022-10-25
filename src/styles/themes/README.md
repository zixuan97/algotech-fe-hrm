author: danielonges

# How to customise light theme/dark theme

In order to understand how theme switching works, there are a few key components we must look at:

1. /src/styles/themes/light-theme.less and /src/styles/themes/dark-theme.less
2. /src/gulpfile.js
3. ThemeSwitcherProvider in /src/index.tsx
4. ThemeContext in /src/context/theme/themeContext.ts

### 1. /src/styles/themes/light-theme.less and /src/styles/themes/dark-theme.less
These files override the default antd.less styles for both light and dark themes. If there needs to be customisations, they should be done through these files.

### 2. /src/gulpfile.js
This gulpfile specifies the compilation pipeline for the theme files. Our custom theme.less files need to be compiled down into normal CSS to be used by the ThemeSwitcherProvider.

After your changes have been made to the theme.less files, run `npx gulp less` in the project directory to compile the theme.less files into css files.

### 3. ThemeSwitcherProvider in /src/index.tsx
This is the provider that allows us to switch between light and dark themes.

### 4. ThemeContext in /src/context/theme/themeContext.ts
This is a context that allows us to retrieve the current theme being applied to the app. The current theme is also stored in localStorage so that it can be persisted even when the user quits the app.




