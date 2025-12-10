const { withAndroidManifest } = require('@expo/config-plugins');

const withBackgroundActions = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application[0];
    
    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }
    const permissions = [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.WAKE_LOCK',
      'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
      'android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS' 
    ];
    
    permissions.forEach(permission => {
        if (!androidManifest.manifest['uses-permission'].some(p => p.$['android:name'] === permission)) {
            androidManifest.manifest['uses-permission'].push({
                $: { 'android:name': permission }
            });
        }
    });

    if (!mainApplication.service) {
      mainApplication.service = [];
    }
    
    const serviceName = 'com.asterinet.react.bgactions.RNBackgroundActionsTask';
    
    let backgroundService = mainApplication.service.find(s => s.$['android:name'] === serviceName);
    
    if (!backgroundService) {
        backgroundService = {
            $: { 
                'android:name': serviceName,
                'android:foregroundServiceType': 'dataSync' 
            }
        };
        mainApplication.service.push(backgroundService);
    } else {
         backgroundService.$['android:foregroundServiceType'] = 'dataSync';
    }


    return config;
  });
};

module.exports = withBackgroundActions;