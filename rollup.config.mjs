import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typeScript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import sourceMaps from 'rollup-plugin-include-sourcemaps';
import postcssImport from 'postcss-import';
import copy from 'rollup-plugin-copy';

const srcDir = 'src'
const buildDir = 'build'

export default args => {
  const stamp = !!args.configDev ? 0 : (new Date()).getTime()
  return {
    input: `${srcDir}/start.js`,
    output: {
      dir: buildDir,
      format: 'iife',
      sourcemap: !!args.configDev,
      entryFileNames: 'start.js',
      globals: {
        fs: 'window',
        path: 'window',
        buffer: 'window',
        inspector: 'window',
        tty: 'window',
        util: 'window',
        os: 'window'
      }
    },
    preserveEntrySignatures: false,
    plugins: [
      resolve(),
      json(),
      commonjs(),
      postcss({
        extract: 'assets/start.css',
        minimize: !!!args.configDev,
        plugins: [postcssImport()]
      }),
      typeScript({
        compilerOptions: {
          sourceMap: !!args.configDev,
          inlineSources: !!args.configDev,
          removeComments: !!!args.configDev
        },
        include: ['./**/*.ts', './**/*.js']
      }),
      sourceMaps(),
      !!!args.configDev ? terser() : {},      
      copy({
        targets: [{
          src: [`./${srcDir}/icons/**/*`, '!**/*.css'],
          dest: `./${buildDir}/assets`
        }, {
          src: `./${srcDir}/winnie.html`,
          dest: `./${buildDir}`
        }],
        copyOnce: true
      })
    ]
  }
};
