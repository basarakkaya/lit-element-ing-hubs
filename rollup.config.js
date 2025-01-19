/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import summary from 'rollup-plugin-summary';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

export default {
  input: 'app-root.js',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  onwarn(warning) {
    if (warning.code !== 'THIS_IS_UNDEFINED') {
      console.error(`(!) ${warning.message}`);
    }
  },
  plugins: [
    replace({
      preventAssignment: true,
      'Reflect.decorate': 'undefined',
      'process.env.NODE_ENV': JSON.stringify(process.env.MODE || 'prod'),
    }),
    resolve(),
    terser({
      ecma: 2021,
      module: true,
      warnings: true,
      mangle: {
        properties: {
          regex: /^__/,
        },
      },
    }),
    copy({
      targets: [
        {
          src: 'index.html',
          dest: 'dist',
          transform: (contents) =>
            contents
              .toString()
              .replace('src="./app-root.js"', 'src="./app-root.bundled.js"'),
        },
        {
          src: ['assets/*', 'styles/*'],
          dest: 'dist',
        },
      ],
    }),
    summary(),
  ],
};
