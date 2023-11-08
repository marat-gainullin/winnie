import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import page from 'rollup-plugin-generate-html-template';
import styles from 'rollup-plugin-styles';
import path from "path";
import assert from "assert";
import shell from 'shelljs';
import fsAsync from 'fs/promises'

const srcDir = 'src';
const testDir = 'test';
const buildDir = 'build';

function cssResolve() {
    const seen = new Set();
    const duplicated = Uint8Array.of();

    function read(file) {
        return fsAsync.readFile(file)
            .then(buffer => {
                const duplicate = seen.has(file);
                seen.add(file);
                return {from: file, source: duplicate ? duplicated : buffer}
            });
    }

    return (url, baseDir, extensions) => {
        return read(path.normalize(path.resolve(baseDir, url)))
            .catch(() => {
                return read(path.normalize(path.resolve('.', 'node_modules', url)))
            });
    }
}

const config = {
    input: path.resolve(testDir, 'start.js'),
    output: {
        file: path.resolve(buildDir, 'start.js'),
        format: "iife",
        sourcemap: true,
        assetFileNames: "assets/[name].[ext]",
    },
    plugins: [
        resolve(),
        commonjs(),
        styles({
            mode: 'extract', minimize: false, import: {
                resolve: cssResolve()
            }
        }),
        babel({
            babelHelpers: 'bundled',
            presets: [['@babel/preset-env', {modules: false}]],
        }),
        page({template: path.resolve(srcDir, 'winnie.html')}),
        {
            name: 'browse', closeBundle: () => {
                const opened = shell.exec(path.resolve(buildDir, 'winnie.html'));
                assert(opened.code === 0, opened.stderr);
            }
        }
    ]
};

export default config;
