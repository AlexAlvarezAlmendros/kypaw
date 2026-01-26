const { withAndroidManifest } = require('@expo/config-plugins');

/**
 * Plugin para añadir la categoría de la app en Android
 * Esto permite que el sistema clasifique correctamente la app
 */
module.exports = function withAndroidCategory(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;
    
    if (manifest.application && manifest.application[0]) {
      // Categoría "productivity" para apps de gestión/organización
      // Otras opciones: "health", "social", "game", "audio", "video", "image", "news", "maps"
      manifest.application[0].$['android:appCategory'] = 'productivity';
    }
    
    return config;
  });
};
