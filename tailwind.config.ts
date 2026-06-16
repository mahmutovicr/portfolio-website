import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent:       '#6ee7b7',
        'accent-inv': '#011a0f',
        tx:           '#d1fae5',
        mu:           '#6b9980',
        dm:           '#2d5044',
        bg:           '#070e0b',
        modal:        '#0b100e',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config