// @ts-check

import { FlatCompat } from '@eslint/eslintrc';
import configTaiyme from '@taiyme/eslint-config';
import configGitignore from 'eslint-config-flat-gitignore';
import tsEslint from 'typescript-eslint';

const compat = new FlatCompat();

export default tsEslint.config(
  configGitignore(),
  { extends: compat.extends('turbo') },
  {
    files: ['**/*.*{js,ts}', '**/*.{jsx,tsx}'],
    extends: configTaiyme.configs.typescript,
  },
  {
    files: ['**/*.{jsx,tsx}'],
    extends: configTaiyme.configs.react,
  },
);
