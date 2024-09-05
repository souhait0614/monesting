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

const baseConfigs = tsEslint.config(
  ...configBase,
  {
    name: 'project/languages',
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        React: 'readonly',
      },
      parser: tsEslint.parser,
      parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    extends: fixupConfigRules(compat.extends('plugin:@next/next/core-web-vitals')).map(((config) => ({
      ...config,
      name: 'project/next',
    }))),
    name: 'project/next',
  },
  {
    name: 'project/react-compiler',
    plugins: {
      'react-compiler': pluginReactCompiler,
    },
    rules: {
      'react-compiler/react-compiler': 'warn',
    },
  },
  {
    name: 'project/panda-css',
    files,
    plugins: {
      '@pandacss': pluginPanda,
    },
    rules: pluginPanda.configs.recommended.rules,
  },
  {
    name: 'project/panda-css',
    rules: {
      '@pandacss/prefer-longhand-properties': 'warn',
      '@pandacss/prefer-unified-property-style': 'warn',
      '@pandacss/no-physical-properties': 'warn',
    },
  },
  {
    name: 'project/react',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
    },
  },
  {
    name: 'project/stylistic',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      '@stylistic/jsx/jsx-sort-props': 'warn',
    },
  },
);

/** @type {Rules} */
const onlyStylisticRules = Object.fromEntries(baseConfigs.flatMap(({ rules = {} }) => Object.keys(rules).filter((key) => !key.startsWith('@stylistic/')).map((key) => [key, 0])));

export default tsEslint.config(
  ...baseConfigs,
  {
    name: 'project/only-stylistic',
    files: ['src/components/**/*.tsx'],
    rules: onlyStylisticRules,
  },
);
