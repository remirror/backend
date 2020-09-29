import fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';

const root = path.resolve(__dirname);

export const config = {
  root,
  tmpdir: process.env.NOW ? `/tmp` : `${root}/.tmp`,
  registry: 'https://registry.npmjs.org',
  npmInstallEnvVars: [] as string[],
  debugEndpoints: true,
  additionalBundleResHeaders: {
    'Cache-Control': 'max-age=86400',
  } as Record<string, string>,
};

if (!process.env.NOW) {
  try {
    rimraf.sync(config.tmpdir);
    fs.mkdirSync(config.tmpdir, { recursive: true });
  } catch {
    // already exists
  }
}

if (process.env.BUNDLE_RUN) {
  config.tmpdir = '/tmp';
  const cacheExpiration = 60 * 60 * 24 * 365;
  config.npmInstallEnvVars = ['npm_config_cache=/tmp'];
  config.debugEndpoints = false;
  config.additionalBundleResHeaders = {
    'Cache-Control': `public, max-age=${cacheExpiration}`,
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Request-Method': 'GET',
    'X-Powered-By': 'github.com/remirror/backend/tree/HEAD/apps/bundle-fetcher',
    'Strict-Transport-Security': `max-age=${cacheExpiration}; includeSubDomains; preload`,
  };
}
