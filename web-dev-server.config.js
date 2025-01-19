/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
import {legacyPlugin} from '@web/dev-server-legacy';
import {fromRollup} from '@web/dev-server-rollup';
import rollupReplace from '@rollup/plugin-replace';

const replace = fromRollup(rollupReplace);
const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true,
  appIndex: 'index.html',
  middleware: [
    function rewriteIndex(context, next) {
      if (!context.url.includes('.') && !context.url.startsWith('/__')) {
        context.url = '/index.html';
      }
      return next();
    },
  ],
  plugins: [
    legacyPlugin({
      polyfills: {
        webcomponents: false,
      },
    }),
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
  ],
};
