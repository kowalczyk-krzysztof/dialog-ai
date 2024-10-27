export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#111113',
        },
        primary: {
          DEFAULT: '#569CD6',
          hover: '#77AFDE',
        },
        secondary: {
          DEFAULT: '#3A3D41',
          hover: '#45484D',
        },
        tertiary: {
          DEFAULT: '#212224',
          hover: '#484A4F',
        },
        text: {
          DEFAULT: '#FFFFFF',
          hover: '#C7C7C7',
        },
        disabled: {
          DEFAULT: '#a1a1aa',
          text: '#707070',
        },
        border: {
          DEFAULT: '#898A8D',
        },
      },
    },
  },

  plugins: [],
}
