import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import glob from 'fast-glob'
import copy from "rollup-plugin-copy";

const destDir = 'build/lib'
const config = {
    input: glob.sync('src/**/*.js'),
    treeshake: false,
    external: [/^@babel\/runtime/, /^septima/, /^kenga/],
    output: {
        dir: destDir,
        format: "cjs",
        exports: "auto",
        preserveModules: true
    },
    plugins: [
        nodeResolve(), commonjs(),
        babel({
            babelHelpers: 'runtime',
            presets: [['@babel/preset-env', {modules: false}]],
            plugins: [["@babel/plugin-transform-runtime", {}]]
        }),
        copy({
            targets: [
                {src: 'src/*.css', dest: destDir},
                {src: 'src/*.html', dest: destDir},
                {src: 'src/icons/css/*', dest: `${destDir}/icons/css`},
                {src: 'src/icons/font/*', dest: `${destDir}/icons/font`},
                {src: 'package.json', dest: destDir}
            ]
        })
    ]
};

export default config;
