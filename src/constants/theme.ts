// Paleta de colores basada en el Wireframe
export const colors = {
  primary: '#4F46E5', // Índigo/Violeta vibrante
  secondary: '#10B981', // Esmeralda
  error: '#EF4444', // Rojo suave
  warning: '#F59E0B', // Amarillo
  background: '#F9FAFB', // Gris muy claro
  surface: '#FFFFFF', // Blanco puro
  textPrimary: '#1F2937', // Gris oscuro
  textSecondary: '#6B7280', // Gris medio
  border: '#E5E7EB',
  success: '#10B981',
};

// Tamaños de tipografía
export const typography = {
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
