// @ts-check

const { theme } = require('app/design/tailwind/theme')

/**
 * @type {import('tailwindcss').Config}
 */

module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/**/*.{js,jsx,ts,tsx}',
  ],
  // @ts-ignore
  // nativewind/preset 적용 시 문제가 있는 것으로 경고가 뜨나 정상 작동 중
  presets: [require('nativewind/preset')],
  theme: {
    ...theme,
  },
  plugins: [],
}
