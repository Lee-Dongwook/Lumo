// @ts-check

/** @type {import('tailwindcss').Config['theme']} */
const theme = {
  // edit your tailwind theme here!
  // https://tailwindcss.com/docs/adding-custom-styles
  extend: {
    colors: {
      // Main colors
      primary: '#00B5E0',
      'primary-100': '#F2FBFD',
      'primary-200': '#E6F8FC',
      secondary: '#1D2958',

      // Gray scale
      gray: {
        900: '#1A1A1A', // rgba(26, 26, 26, 1)
        700: '#4D4D4D',
        600: '#E4E4E4',
        500: '#B3B3B3',
        400: '#BBBFCD',
        300: '#E8EAEE',
        bd: '#D1D5DB', // border
      },
      red: {
        100: '#FF718B',
        200: '#FF6783',
      },

      // Blue gray
      'blue-gray': {
        700: '#8394B7',
        500: '#BBBFCD',
        300: '#BBBFCD',
      },

      green: {
        200: '#3FB26C',
      },

      // Background
      background: '#F0F4F9',

      // Point colors
      point: {
        coral: '#F67462',
        purple: '#91B3F8',
        pink: '#F67462',
        yellow: '#F4D260',
        green: '#69CD59',
        'blue-light': '#4F96FF',
        'blue-default': '#7387F2',
      },

      // custom button
      btn: {
        primary: '#2563EB',
      },
    },
    fontFamily: {
      pretendard: ['Pretendard'],
      roboto: ['Roboto'],
    },
    fontSize: {
      // Title sizes
      t1: ['24px', { lineHeight: '36px', letterSpacing: '0' }],
      t2: ['20px', { lineHeight: '30px', letterSpacing: '0' }],
      t3: ['18px', { lineHeight: '27px', letterSpacing: '0' }],

      md: '16px',

      // Content sizes
      c1: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
      c2: ['14px', { lineHeight: '21px', letterSpacing: '0' }],
      c3: ['12px', { lineHeight: '18px', letterSpacing: '0' }],
    },
    spacing: {
      4.5: '1.125rem',
      5.5: '1.375rem',
      11.5: '2.875rem',
      15: '3.75rem',
      67: '16.75rem',
      22: '5.5rem',
    },
  },
}

module.exports = {
  theme,
}
