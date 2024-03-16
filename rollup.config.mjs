import commonjs from '@rollup/plugin-commonjs';
import eslint from '@rollup/plugin-eslint';
import json from '@rollup/plugin-json';
import run from '@rollup/plugin-run';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';
import dotenv from 'rollup-plugin-dotenv';
import nodeExternals from 'rollup-plugin-node-externals';
import tsconfigPaths from 'rollup-plugin-tsconfig-paths';

const dev = process.env.ROLLUP_WATCH === 'true';
const enableTerser = false;

export default {
  input: ['src/index.ts'],
  externals: [
    nodeExternals(),
  ],
  resolve: {
    plugins: [tsconfigPaths(
      {
        tsConfigPath: './tsconfig.json'
      }
    )]
  },
	plugins: [
    // Transpile TypeScript to JavaScript
    typescript(
      {
        tsconfig: 'tsconfig.json',
        sourceMap: true,
        inlineSourceMap: true,
        inlineSources: true,
      }
    ),
    // Copy files from src to dist
    copy({
      // Ex:
      // targets: [
        //   { src: 'src/config', dest: 'dist' },
        // ],
    }),
    // Lint TypeScript files
    eslint({
      fix: true,
      throwOnError: true,
      throwOnWarning: false,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'dist/**'],
    }),
    // Terser
    enableTerser &&
      terser({
        format: {
          comments: false,
        },
      }),
    // Parse JSON files
    json(),
    // Load environment variables
    dotenv(),
    // Convert CommonJS modules to ES6
    commonjs(),
    // Run the application in watch mode if run with the watch flag
    dev && run(
      {
        execArgv: ['-r', 'source-map-support/register'],
      }
      ),
  ],
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
    }
  ],
};
