/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-check

import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
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
    name: 'project/react',
    files: ['**/*.{jsx,tsx}'],
    rules: {
      'react/function-component-definition': [
        'warn',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            // NOTE: Pigment CSS
            'sx',
          ],
        },
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
    files: ['src/components/ui/**/*.*'],
    rules: onlyStylisticRules,
  },
);
