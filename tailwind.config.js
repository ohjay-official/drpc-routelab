/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    // Square-ish corners only. There is deliberately no "full" radius.
    borderRadius: { none: '0', DEFAULT: '2px', sm: '2px', md: '2px', lg: '2px' },
    extend: {
      colors: {
        paper: '#f3f1ec',
        card: '#faf9f6',
        ink: '#16150f',
        rule: '#d8d4c8',
        mute: '#6b6759',
        accent: '#1c3ffb',
        ok: '#17794a',
        warn: '#9a6400',
        bad: '#c0301a',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [],
}
