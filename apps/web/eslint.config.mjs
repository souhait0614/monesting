/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-check

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
// @ts-expect-error
import pluginPanda from '@pandacss/eslint-plugin';
import { configBase } from '@repo/eslint-config';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

/**
 * @typedef {import('eslint').Linter.Config} Config
 * @typedef {import('eslint').ESLint.Plugin} Plugin
 * @typedef {import('eslint').Linter.RulesRecord} Rules
 */

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});


/** @type {Rules} */
const onlyStylisticRules = Object.fromEntries(configBase.flatMap(({ rules = {} }) => Object.entries(rules).map(([key, rule]) => [key, rule && key.startsWith('@stylistic/') ? rule : 0])));

export default tsEslint.config(
  {
    extends: configBase,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        React: 'readonly',
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
  {
    files: ['**/*.*{js,ts}', '**/*.{jsx,tsx}'],
    plugins: {
      '@pandacss': pluginPanda,
    },
    rules: {
      ...pluginPanda.configs.recommended.rules,
    },
  },
  {
    files: ['src/components/**/*.tsx'],
    rules: onlyStylisticRules,
  },
);
