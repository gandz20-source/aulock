/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./*.html"],
  theme: {
    extend: {
      colors: {
        'anti-bg': '#0f172a',
        'anti-text-base': '#f1f5f9',
        'anti-text-muted': '#64748b',
        'anti-primary': {
          DEFAULT: '#22d3ee',
          hover: '#06b6d4'
        },
        'anti-secondary': '#e879f9',
        // Paleta de colores Ciber-Tech HUD
        'hud-dark': '#000000',
        'hud-gray': '#1A1A1A',
        'hud-cyan': '#38EBCB',
        'hud-cyan-soft': '#22d3ee',
        'hud-magenta': '#D946EF',
        'hud-green': '#A8FF00',
        'hud-blue': '#007BFF',
        'hud-orange': '#FF8C00',
        'hud-purple': '#9C27B0',
        'hud-red': '#EF4444',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'orbitron': ['Orbitron', 'sans-serif'],
        'mono': ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'cyan-glow': '0 4px 6px -1px rgba(34, 211, 238, 0.1), 0 2px 4px -1px rgba(34, 211, 238, 0.06)',
        'neon-cyan': '0 0 10px #38EBCB, 0 0 20px #38EBCB, 0 0 40px #007BFF',
        'neon-magenta': '0 0 10px #D946EF, 0 0 20px #D946EF',
        'neon-green': '0 0 10px #A8FF00, 0 0 20px #A8FF00',
        'card-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(6, 182, 212, 0.1)',
      },
      dropShadow: {
        'text-cyan': '0 0 5px #38EBCB',
        'text-magenta': '0 0 5px #D946EF',
      }
    },
  },
  plugins: [],
}
