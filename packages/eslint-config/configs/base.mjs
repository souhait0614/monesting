// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import configTaiyme from '@taiyme/eslint-config';
import configGitignore from 'eslint-config-flat-gitignore';

const compat = new FlatCompat();

/** @type {import("eslint").Linter.Config[]} */
export default [
  { name: 'base/defaults/gitignore', ...configGitignore() },
  ...compat.extends('turbo').map((config) => ({
    name: 'base/defaults/turbo',
    ...config,
  })),
  ...configTaiyme.configs.typescript.map((config) => ({
    name: 'base/defaults/taiyme',
    files: ['**/*.*{js,ts}', '**/*.{jsx,tsx}'],
    ...config,
  })),
  ...configTaiyme.configs.react.map((config) => ({
    name: 'base/defaults/taiyme',
    files: ['**/*.{jsx,tsx}'],
    ...config,
  })),
];
