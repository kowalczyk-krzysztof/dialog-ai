export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#111113',
        },
        primary: {
          DEFAULT: '#4FC1FF',
          hover: '#78CFFF',
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
          hover: '#d4d4d4',
        },
        disabled: {
          DEFAULT: '#a1a1aa',
          text: '#707070',
        },
        border: {
          DEFAULT: '#898A8D',
        },
        badge: {
          user: '#3A8DFF',
          ai: '#5A20CB',
          translation: '#28A745',
          chat: '#6F42C1',
          summarization: '#FD7E14',
        },
        error: {
          DEFAULT: '#f14c4c',
          hover: '#F47272',
        },
        success: {
          DEFAULT: '#28A745',
          hover: '#3CB371',
        },
      },
    },
  },

  plugins: [],
}
