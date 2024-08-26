// @ts-check

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import { configBase } from '@repo/eslint-config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default tsEslint.config(
  {
    extends: configBase,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parser: tsEslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.*{js,ts}', '**/*.{jsx,tsx}'],
    extends: fixupConfigRules(compat.extends('plugin:@next/next/core-web-vitals')),
  },
);
