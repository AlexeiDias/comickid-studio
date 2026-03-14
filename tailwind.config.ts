import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'cursive'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        ink: '#1a1a2e',
        paper: '#fff8f0',
      },
    },
  },
  plugins: [],
};

export default config;
