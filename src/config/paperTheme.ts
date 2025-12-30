import { MD3LightTheme, configureFonts } from 'react-native-paper';
import { colors, typography } from '../constants/theme';

const fontConfig = {
  displayLarge: {
    ...typography.h1,
    fontFamily: 'System',
  },
  displayMedium: {
    ...typography.h2,
    fontFamily: 'System',
  },
  displaySmall: {
    ...typography.h3,
    fontFamily: 'System',
  },
  bodyLarge: {
    ...typography.body,
    fontFamily: 'System',
  },
  bodyMedium: {
    ...typography.body,
    fontFamily: 'System',
  },
  bodySmall: {
    ...typography.caption,
    fontFamily: 'System',
  },
};

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    background: colors.background,
    surface: colors.surface,
    onSurface: colors.textPrimary,
    onBackground: colors.textPrimary,
  },
  fonts: configureFonts({ config: fontConfig }),
};
