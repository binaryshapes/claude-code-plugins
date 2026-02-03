/** @type {import("prettier").Config} */
export default {
  // Line width
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,

  // Strings
  singleQuote: true,
  jsxSingleQuote: false,

  // Trailing commas
  trailingComma: 'es5',

  // Brackets and spacing
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',

  // Semicolons
  semi: true,

  // Prose wrapping for markdown
  proseWrap: 'preserve',

  // End of line
  endOfLine: 'lf',

  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',

  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line in JSX/HTML
  singleAttributePerLine: false,

  // Plugins (add as needed)
  plugins: [],

  // Overrides for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
        printWidth: 80,
      },
    },
  ],
};
