// @ts-check
import makeWithBundleAnalyzer from '@next/bundle-analyzer';
import { Config } from 'next-recompose-plugins';

const withBundleAnalyzer = makeWithBundleAnalyzer({
  // eslint-disable-next-line turbo/no-undeclared-env-vars
  enabled: process.env.ANALYZE === 'true',
});

export default new Config({
  experimental: {
    typedRoutes: true,
    reactCompiler: true,
  },
})
  .applyPlugin((phase, args, config) => withBundleAnalyzer(config))
  .build();
