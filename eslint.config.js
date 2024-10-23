import tseslint from 'typescript-eslint'
import eslint from '@eslint/js'
import tailwind from 'eslint-plugin-tailwindcss'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-multi-spaces': 1,
      'no-useless-escape': 0,
      'no-unused-expressions': 2,
      'no-duplicate-imports': 1,
      'no-useless-return': 'error',
      'rest-spread-spacing': 'error',
      'no-var': 'error',
      'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
    },
    ignores: ['dist', 'eslint.config.json', 'node_modules'],
    files: ['**/*.{js,ts,jsx,tsx}'],
  }
)
