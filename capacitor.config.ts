import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'COLREGS',
  webDir: 'www',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: true,
  },
  plugins: {
    Network: {
      // You can add plugin configuration options here, if necessary
    },
  },

  server: {
    androidScheme: 'http',

    cleartext: true,

    allowNavigation: ['https://du9ljqwb0wl5x.cloudfront.net/api'],
  },
};

export default config;
