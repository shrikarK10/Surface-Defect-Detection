/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        panel: '#0b0b0b',
        muted: '#1e1e1e',
        text: '#e6e6e6',
        'muted-text': '#9aa3b2',
        'accent-blue': '#1f7aec',
        'accent-red': '#e53935',
        success: '#22c55e',
      },
    },
  },
  plugins: [],
};

