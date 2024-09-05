/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-check

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
// @ts-expect-error
import pluginPanda from '@pandacss/eslint-plugin';
import { configBase } from '@repo/eslint-config';
// @ts-expect-error
import pluginReactCompiler from 'eslint-plugin-react-compiler';
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

const files = ['**/*.*{js,ts}', '**/*.{jsx,tsx}'];

/** @type {Rules} */
const onlyStylisticRules = Object.fromEntries(configBase.flatMap(({ rules = {} }) => Object.keys(rules).filter((key) => !key.startsWith('@stylistic/')).map((key) => [key, 0])));

export default tsEslint.config(
  ...configBase,
  {
    name: 'project/settings/languages',
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
    extends: fixupConfigRules(compat.extends('plugin:@next/next/core-web-vitals')).map(((config) => ({
      ...config,
      name: 'project/defaults/next',
    }))),
    name: 'project/settings/next',
  },
  {
    name: 'project/settings/react-compiler',
    plugins: {
      'react-compiler': pluginReactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'warn',
    },
  },
  {
    name: 'project/defaults/panda-css',
    files,
    plugins: {
      '@pandacss': pluginPanda,
    },
    rules: pluginPanda.configs.recommended.rules,
  },
  {
    name: 'project/settings/panda-css',
    rules: {
      '@pandacss/prefer-longhand-properties': 'warn',
      '@pandacss/prefer-unified-property-style': 'warn',
      '@pandacss/no-physical-properties': 'warn',
    },
  },
  {
    name: 'project/settings/taiyme',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      '@stylistic/jsx/jsx-sort-props': 'warn',
    },
  },
  {
    name: 'project/settings/only-stylistic',
    files: ['src/components/**/*.tsx'],
    rules: onlyStylisticRules,
  },
);
