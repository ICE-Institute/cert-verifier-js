import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/verifier.js',
      format: 'cjs',
      name: 'Verifier'
    },
    {
      file: 'dist/verifier-es.js',
      format: 'es',
      name: 'Verifier'
    }
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true,
      extensions: ['.js', '.json']
    }),
    typescript(),
    commonjs({
      namedExports: {
        debug: ['debug'],
        'bitcoinjs-lib': ['bitcoin']
      }
    }),
    json(),
    globals(),
    builtins(),
    terser()
  ]
};
