// @ts-check
import { createTheme } from '@mui/material';
import makeWithBundleAnalyzer from '@next/bundle-analyzer';
import { withPigment } from '@pigment-css/nextjs-plugin';
import { Config } from 'next-recompose-plugins';


const withBundleAnalyzer = makeWithBundleAnalyzer({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('@pigment-css/nextjs-plugin').PigmentOptions}
 */
const pigmentConfig = {
  transformLibraries: ['@mui/material'],
  theme: createTheme(),
};

export default new Config({
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
})
  .applyPlugin((phase, args, config) => withBundleAnalyzer(config))
  .applyPlugin((phase, args, config) => withPigment(config, pigmentConfig))
  .build();
