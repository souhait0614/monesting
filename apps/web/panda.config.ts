import { defineConfig, defineGlobalStyles } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

const globalCss = defineGlobalStyles({
  'html, body': {
    width: '100%',
    height: '100%',
  },
});

export default defineConfig({
  // Whether to use css reset
  preflight: true,
  presets: ['@pandacss/preset-base', createPreset({
    grayColor: 'sage',
    accentColor: 'jade',
  })],
  // Where to look for your css declarations
  include: ['./src/components/**/*.{ts,tsx,js,jsx}', './src/app/**/*.{ts,tsx,js,jsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      containerSizes: {
        xs: '320px',
        sm: '384px',
        md: '448px',
        lg: '512px',
        xl: '576px',
        '2xl': '672px',
        '3xl': '768px',
        '4xl': '896px',
        '5xl': '1024px',
        '6xl': '1152px',
        '7xl': '1280px',
        '8xl': '1440px',
      },
    },
  },
  minify: true,
  jsxFramework: 'react',
  // The output directory for your css system
  outdir: 'styled-system',
  globalCss,
});
