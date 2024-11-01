export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      willChange: {
        'left-top': 'left, top',
      },
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
          user: '#0051C2',
          ai: '#5A20CB',
          translation: '#145222',
          chat: '#683CB9',
          summarization: '#8D4002',
          error: '#8E0B0B',
        },
        error: {
          DEFAULT: '#B30F0F',
          hover: '#D91212',
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
