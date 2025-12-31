/**
 * Sistema de colores Material Design 3
 * Basado en la paleta del Wireframe adaptada a MD3
 */
export const colors = {
  // Color primario (Índigo/Violeta vibrante)
  primary: '#4F46E5',
  onPrimary: '#FFFFFF',
  primaryContainer: '#E0DEFF',
  onPrimaryContainer: '#13005C',
  
  // Color secundario (Lila/Púrpura)
  secondary: '#7C3AED',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#EDE9FE',
  onSecondaryContainer: '#2E1065',
  
  // Color terciario (para variedad)
  tertiary: '#7C4DFF',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#EADDFF',
  onTertiaryContainer: '#21005E',
  
  // Error
  error: '#EF4444',
  onError: '#FFFFFF',
  errorContainer: '#FECACA',
  onErrorContainer: '#7F1D1D',
  
  // Background
  background: '#F9FAFB',
  onBackground: '#1F2937',
  
  // Surface
  surface: '#FFFFFF',
  onSurface: '#1F2937',
  surfaceVariant: '#E5E7EB',
  onSurfaceVariant: '#6B7280',
  
  // Outline
  outline: '#D1D5DB',
  outlineVariant: '#E5E7EB',
  
  // Otros
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#1F2937',
  inverseOnSurface: '#F9FAFB',
  inversePrimary: '#BDB6FF',
  
  // Colores adicionales para la app
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',
  
  // Elevaciones (superficie con elevación)
  elevation: {
    level0: '#FFFFFF',
    level1: '#F3F4F6',
    level2: '#E5E7EB',
    level3: '#D1D5DB',
    level4: '#9CA3AF',
    level5: '#6B7280',
  },
  
  // Aliases para retrocompatibilidad
  // @deprecated - Usar los tokens MD3 en su lugar
  textPrimary: '#1F2937',  // Usar onSurface en su lugar
  textSecondary: '#6B7280', // Usar onSurfaceVariant en su lugar
  border: '#E5E7EB',        // Usar outline en su lugar
};

/**
 * Colores para modo oscuro (Dark Theme)
 */
export const darkColors = {
  primary: '#BDB6FF',
  onPrimary: '#2B1D7A',
  primaryContainer: '#3F32A0',
  onPrimaryContainer: '#E0DEFF',
  
  secondary: '#C4B5FD',
  onSecondary: '#3B1C6B',
  secondaryContainer: '#5B21B6',
  onSecondaryContainer: '#EDE9FE',
  
  tertiary: '#D0BCFF',
  onTertiary: '#381E72',
  tertiaryContainer: '#4F378A',
  onTertiaryContainer: '#EADDFF',
  
  error: '#F87171',
  onError: '#7F1D1D',
  errorContainer: '#991B1B',
  onErrorContainer: '#FECACA',
  
  background: '#1F2937',
  onBackground: '#E5E7EB',
  
  surface: '#1F2937',
  onSurface: '#E5E7EB',
  surfaceVariant: '#374151',
  onSurfaceVariant: '#9CA3AF',
  
  outline: '#6B7280',
  outlineVariant: '#4B5563',
  
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#E5E7EB',
  inverseOnSurface: '#1F2937',
  inversePrimary: '#4F46E5',
  
  success: '#6EE7B7',
  warning: '#FBBF24',
  info: '#60A5FA',
  
  elevation: {
    level0: '#1F2937',
    level1: '#2D3748',
    level2: '#374151',
    level3: '#4B5563',
    level4: '#6B7280',
    level5: '#9CA3AF',
  },
  
  // Aliases para retrocompatibilidad
  // @deprecated - Usar los tokens MD3 en su lugar
  textPrimary: '#E5E7EB',  // Usar onSurface en su lugar
  textSecondary: '#9CA3AF', // Usar onSurfaceVariant en su lugar
  border: '#6B7280',        // Usar outline en su lugar
};

/**
 * Sistema de tipografía Material Design 3
 * Incluye todas las escalas: Display, Headline, Title, Body, Label
 */
export const typography = {
  // Display: Para textos muy grandes y destacados
  displayLarge: {
    fontSize: 57,
    fontWeight: '400' as const,
    lineHeight: 64,
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    fontWeight: '400' as const,
    lineHeight: 52,
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    fontWeight: '400' as const,
    lineHeight: 44,
    letterSpacing: 0,
  },
  
  // Headline: Para encabezados importantes
  headlineLarge: {
    fontSize: 32,
    fontWeight: '400' as const,
    lineHeight: 40,
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    fontWeight: '400' as const,
    lineHeight: 36,
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    fontWeight: '400' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  
  // Title: Para títulos de secciones y cards
  titleLarge: {
    fontSize: 22,
    fontWeight: '400' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  
  // Body: Para texto principal
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  
  // Label: Para etiquetas y botones
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  
  // Aliases para retrocompatibilidad con código existente
  // @deprecated - Usar las escalas MD3 en su lugar
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
};

// Espaciado
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Bordes redondeados
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
