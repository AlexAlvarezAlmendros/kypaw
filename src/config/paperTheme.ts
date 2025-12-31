import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { colors, darkColors, typography } from '../constants/theme';

/**
 * Configuración de fuentes Material Design 3
 * Todas las escalas tipográficas según las especificaciones de MD3
 */
const fontConfig = {
  // Display
  displayLarge: {
    ...typography.displayLarge,
    fontFamily: 'System',
  },
  displayMedium: {
    ...typography.displayMedium,
    fontFamily: 'System',
  },
  displaySmall: {
    ...typography.displaySmall,
    fontFamily: 'System',
  },
  // Headline
  headlineLarge: {
    ...typography.headlineLarge,
    fontFamily: 'System',
  },
  headlineMedium: {
    ...typography.headlineMedium,
    fontFamily: 'System',
  },
  headlineSmall: {
    ...typography.headlineSmall,
    fontFamily: 'System',
  },
  // Title
  titleLarge: {
    ...typography.titleLarge,
    fontFamily: 'System',
  },
  titleMedium: {
    ...typography.titleMedium,
    fontFamily: 'System',
  },
  titleSmall: {
    ...typography.titleSmall,
    fontFamily: 'System',
  },
  // Body
  bodyLarge: {
    ...typography.bodyLarge,
    fontFamily: 'System',
  },
  bodyMedium: {
    ...typography.bodyMedium,
    fontFamily: 'System',
  },
  bodySmall: {
    ...typography.bodySmall,
    fontFamily: 'System',
  },
  // Label
  labelLarge: {
    ...typography.labelLarge,
    fontFamily: 'System',
  },
  labelMedium: {
    ...typography.labelMedium,
    fontFamily: 'System',
  },
  labelSmall: {
    ...typography.labelSmall,
    fontFamily: 'System',
  },
};

/**
 * Tema claro Material Design 3
 * Basado en la paleta de colores del Wireframe
 */
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Colores primarios
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primaryContainer,
    onPrimaryContainer: colors.onPrimaryContainer,
    
    // Colores secundarios
    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondaryContainer: colors.onSecondaryContainer,
    
    // Colores terciarios
    tertiary: colors.tertiary,
    onTertiary: colors.onTertiary,
    tertiaryContainer: colors.tertiaryContainer,
    onTertiaryContainer: colors.onTertiaryContainer,
    
    // Error
    error: colors.error,
    onError: colors.onError,
    errorContainer: colors.errorContainer,
    onErrorContainer: colors.onErrorContainer,
    
    // Background
    background: colors.background,
    onBackground: colors.onBackground,
    
    // Surface
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.onSurfaceVariant,
    
    // Outline
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
    
    // Shadow & Scrim
    shadow: colors.shadow,
    scrim: colors.scrim,
    
    // Inverse
    inverseSurface: colors.inverseSurface,
    inverseOnSurface: colors.inverseOnSurface,
    inversePrimary: colors.inversePrimary,
    
    // Elevaciones
    elevation: colors.elevation,
  },
  fonts: configureFonts({ config: fontConfig }),
};

/**
 * Tema oscuro Material Design 3
 * Paleta adaptada para modo oscuro
 */
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Colores primarios
    primary: darkColors.primary,
    onPrimary: darkColors.onPrimary,
    primaryContainer: darkColors.primaryContainer,
    onPrimaryContainer: darkColors.onPrimaryContainer,
    
    // Colores secundarios
    secondary: darkColors.secondary,
    onSecondary: darkColors.onSecondary,
    secondaryContainer: darkColors.secondaryContainer,
    onSecondaryContainer: darkColors.onSecondaryContainer,
    
    // Colores terciarios
    tertiary: darkColors.tertiary,
    onTertiary: darkColors.onTertiary,
    tertiaryContainer: darkColors.tertiaryContainer,
    onTertiaryContainer: darkColors.onTertiaryContainer,
    
    // Error
    error: darkColors.error,
    onError: darkColors.onError,
    errorContainer: darkColors.errorContainer,
    onErrorContainer: darkColors.onErrorContainer,
    
    // Background
    background: darkColors.background,
    onBackground: darkColors.onBackground,
    
    // Surface
    surface: darkColors.surface,
    onSurface: darkColors.onSurface,
    surfaceVariant: darkColors.surfaceVariant,
    onSurfaceVariant: darkColors.onSurfaceVariant,
    
    // Outline
    outline: darkColors.outline,
    outlineVariant: darkColors.outlineVariant,
    
    // Shadow & Scrim
    shadow: darkColors.shadow,
    scrim: darkColors.scrim,
    
    // Inverse
    inverseSurface: darkColors.inverseSurface,
    inverseOnSurface: darkColors.inverseOnSurface,
    inversePrimary: darkColors.inversePrimary,
    
    // Elevaciones
    elevation: darkColors.elevation,
  },
  fonts: configureFonts({ config: fontConfig }),
};

/**
 * Tema por defecto (claro)
 * @deprecated Usar lightTheme en su lugar
 */
export const paperTheme = lightTheme;
