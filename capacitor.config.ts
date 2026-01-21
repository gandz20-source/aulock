import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.aulock.tracker',
    appName: 'Aulock Tracker',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        // For development, you can set this to your local network IP
        // Example: url: 'http://192.168.1.100:5173'
        // For production, comment out the url
    },
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: '#1e293b',
            showSpinner: false,
        },
        StatusBar: {
            style: 'dark',
            backgroundColor: '#1e293b',
        },
    },
};

export default config;
