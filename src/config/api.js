import { Capacitor } from '@capacitor/core';

// Detect if running on mobile platform
const isMobile = Capacitor.isNativePlatform();

// Base API URL configuration
// For development: use your local network IP (e.g., 'http://192.168.1.100:3000')
// For production: use your deployed backend URL (e.g., 'https://api.aulock.com')
const API_BASE_URL = isMobile
    ? 'http://192.168.0.7:3000' // Your local network IP
    : 'http://localhost:3000';

export { API_BASE_URL, isMobile };
