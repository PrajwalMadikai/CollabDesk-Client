import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        kanit: ['"Kanit"', 'sans-serif'],
      },
      animation: {
        'fade-down': 'fadeDown 1s ease-out',
        'fade-right': 'fadeRight 1s ease-out',  
      },
      keyframes: {
        fadeDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeRight: {  
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',  
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',  
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
