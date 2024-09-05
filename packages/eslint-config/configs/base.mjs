// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import configTaiyme from '@taiyme/eslint-config';
import configGitignore from 'eslint-config-flat-gitignore';

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config[]} */
export default [
  configGitignore(),
  ...configTaiyme.configs.typescript.map((config) => ({
    ...config,
    files: ['**/*.*{js,ts}', '**/*.{jsx,tsx}'],
  })),
  ...configTaiyme.configs.react.map((config) => ({
    ...config,
    files: ['**/*.{jsx,tsx}'],
  })),
  ...compat.extends('turbo').map((config) => ({
    ...config,
    name: 'base/turbo',
  })),
];
