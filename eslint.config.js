import globals from 'globals'
import pluginJs from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import pluginReact from 'eslint-plugin-react'

export default [
  // 적용 대상 파일 지정
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    ignores: [
      '**/node_modules/**',
      'packages/app/public/**',
      'dist/**',
      'build/**',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, ...globals.node },
    },
  },
  pluginJs.configs.recommended, // JavaScript 추천 규칙
  pluginReact.configs.flat.recommended, // React 추천 규칙
  {
    rules: {
      'react/react-in-jsx-scope': 'off', // Next.js에서는 React import 불필요
      'import/no-extraneous-dependencies': 'off', // 외부 종속성 경고 끄기
      'react/jsx-filename-extension': [
        'warn',
        { extensions: ['.tsx', '.jsx'] },
      ], // JSX 확장자 허용
      'no-unused-vars': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 경고
    },
  },
]
