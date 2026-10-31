/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    borderRadius: { none: '0', sm: '4px', DEFAULT: '6px', md: '8px', lg: '10px', xl: '12px', '2xl': '16px', '3xl': '24px', full: '9999px' },
    extend: {
      colors: {
        ok: '#15803d', warn: '#b45309', bad: '#dc2626',
        // dRPC logo greens, sampled from the mark. brand-ink is the text-safe shade on the light page.
        brand: '#41e278', 'brand-light': '#49ff87', 'brand-deep': '#33b05d', 'brand-ink': '#15803d', 'brand-hover': '#166534', dark: '#161616',
      },
      maxWidth: { page: '72rem' },
    },
  },
  plugins: [],
}
