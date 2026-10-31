/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    borderRadius: { none: '0', sm: '4px', DEFAULT: '6px', md: '8px', lg: '10px', xl: '12px', '2xl': '16px', '3xl': '24px', full: '9999px' },
    extend: {
      colors: { ok: '#15803d', warn: '#b45309', bad: '#dc2626', drpc: { DEFAULT: '#41E278', deep: '#35B05D' } },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [],
}
