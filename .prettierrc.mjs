/** @type {import("prettier").Config} */
export default {
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  printWidth: 120,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  overrides: [
    {
      files: ['**/*.css', '**/*.html', '**/*.json', '**/*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
}
