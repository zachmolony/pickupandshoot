import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  plugins: [formsPlugin, typographyPlugin],
  theme: {
    screens: {
      md: '390px',
      'md-pro-max': '430px',
      lg: '640px',
    },
    extend: {
      colors: {
        'puas-green': '#00ff00',
        screen: '#121212',
      },
      borderWidth: {
        24: '24px',
      },
    },
  },
};
