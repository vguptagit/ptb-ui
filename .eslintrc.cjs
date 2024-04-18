module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true, jest: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'prettier/prettier': 'off',
    'react/jsx-no-target-blank': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-unused-vars': 'off',
    'no-redeclare': 'off',
    'no-constant-condition': 'off',
    'no-empty': 'off',
    'react/prop-types': 'off',
    'react/no-unknown-property': 'off',
    'react/jsx-key': 'off',
    'no-unsafe-optional-chaining': 'off',
    'react/display-name': 'off',
    'no-fallthrough': 'off',
    'no-useless-escape': 'off',
  },
};
