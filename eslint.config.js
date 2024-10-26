import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import tailwind from 'eslint-plugin-tailwindcss'
import react from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  jsxA11y.flatConfigs.recommended,
  {
    settings: {
      react: {
        version: '18.0.0',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': hooksPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-multi-spaces': 'warn',
      'no-useless-escape': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@eslint-js/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'warn',
      'no-useless-return': 'error',
      'rest-spread-spacing': 'error',
      'no-var': 'error',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
      'react/no-array-index-key': 'warn',
      'react/jsx-no-leaked-render': 'error',
      ...hooksPlugin.configs.recommended.rules,
    },
    ignores: ['dist', 'eslint.config.json', 'node_modules'],
    files: ['**/*.{js,ts,jsx,tsx}'],
  }
)
