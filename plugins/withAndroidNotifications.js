/**
 * Plugin de Expo para configurar notificaciones en Android
 * 
 * Añade los permisos necesarios para alarmas exactas y notificaciones
 * que se disparan aunque la app esté cerrada
 */

const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withAndroidNotifications(config) {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;
    
    // Asegurar que el array de permisos existe
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }
    
    // Lista de permisos necesarios para notificaciones programadas
    const requiredPermissions = [
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.USE_EXACT_ALARM',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.WAKE_LOCK',
      'android.permission.VIBRATE',
    ];
    
    // Añadir permisos que falten
    for (const permission of requiredPermissions) {
      const exists = manifest['uses-permission'].some(
        (p) => p.$?.['android:name'] === permission
      );
      
      if (!exists) {
        manifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
        console.log(`[withAndroidNotifications] Added permission: ${permission}`);
      }
    }
    
    // Buscar la aplicación
    const application = manifest.application?.[0];
    if (application) {
      // Asegurar que receiver existe
      if (!application.receiver) {
        application.receiver = [];
      }
      
      // Añadir receiver para BOOT_COMPLETED si no existe
      const bootReceiverExists = application.receiver.some(
        (r) => r.$?.['android:name']?.includes('BootReceiver')
      );
      
      if (!bootReceiverExists) {
        application.receiver.push({
          $: {
            'android:name': '.BootReceiver',
            'android:enabled': 'true',
            'android:exported': 'true',
          },
          'intent-filter': [
            {
              action: [{ $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } }],
            },
          ],
        });
        console.log('[withAndroidNotifications] Added BootReceiver');
      }
    }
    
    return config;
  });
};
