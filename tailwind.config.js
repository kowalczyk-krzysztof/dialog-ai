export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#101842',
          hover: '#203084',
        },
        primary: {
          DEFAULT: '#5A6BC0',
          hover: '#95A0D7',
        },
        secondary: {
          DEFAULT: '#5F6896',
          hover: '#8F95B8',
        },
        tertiary: {
          DEFAULT: '#4662EB',
          hover: '#90A0F3',
        },
        text: {
          DEFAULT: '#ffffff',
          hover: '#C7C7C7',
        },
        disabled: {
          DEFAULT: '#d1d5db',
          text: '#94a3b8',
        },
        border: {
          DEFAULT: '#1f2d3d',
        },
      },
    },
  },
  plugins: [],
}
