import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

// Initialize Capacitor plugins for mobile
if (Capacitor.isNativePlatform()) {
  // Hide splash screen after app loads
  SplashScreen.hide();

  // Configure status bar
  StatusBar.setStyle({ style: Style.Light });
  StatusBar.setBackgroundColor({ color: '#f8fafc' });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
