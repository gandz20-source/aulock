import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// TEMPORARY DEBUG APP
// If this renders, the issue is inside the Contexts or Routes
function App() {
  return (
    <div className="p-10 bg-slate-900 text-white h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-green-400">SYSTEM DIAGNOSTIC: ONLINE</h1>
      <p className="mt-4 text-xl">App.jsx is mounting correctly.</p>
      <p className="text-slate-400">If you see this, the "Blackout" is caused by a child component (AuthContext or Router).</p>
      <button
        className="mt-8 px-6 py-3 bg-red-600 rounded hover:bg-red-700 font-bold"
        onClick={() => window.location.reload()}
      >
        Reload Page
      </button>
    </div>
  );
}

export default App;
