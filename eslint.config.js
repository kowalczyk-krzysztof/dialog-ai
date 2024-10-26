import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import tailwind from 'eslint-plugin-tailwindcss'
import react from 'eslint-plugin-react'
import hooksPlugin from 'eslint-plugin-react-hooks'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
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
    },
    rules: {
      'no-multi-spaces': 'warn',
      'no-useless-escape': 'warn',
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
