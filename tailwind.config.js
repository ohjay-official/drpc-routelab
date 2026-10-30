/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0d1015', panel: '#151a22', line: '#252c38', ink: '#e6e9ef', mute: '#8b94a5',
        signal: '#6ea8ff', ok: '#4ade80', warn: '#f59e0b', bad: '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
