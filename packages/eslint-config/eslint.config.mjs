// @ts-check

import globals from 'globals';
import tsEslint from 'typescript-eslint';

import { configBase } from './index.mjs';

export default tsEslint.config({
  extends: configBase,
  languageOptions: {
    globals: {
      ...globals.node,
    },
    parser: tsEslint.parser,
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: './tsconfig.json',
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
