import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from "rollup-plugin-babel";
import {terser} from "rollup-plugin-terser";
import * as pkg from './package.json';
// import { wasm } from '@rollup/plugin-wasm';

const extensions = ['.mjs', '.js', '.json', '.node', '.ts'];
const name = 'deepnet';

const config = {
    input: 'src/core/engine/autograd.ts',    
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    ],
    plugins: [
      
      resolve({
        preferBuiltins: true,        
        browser:false,
        extensions,
      }),,  
      
      commonjs(), 
      
      babel({
        extensions,        
        include: ['src/**/*'],
        exclude: ['node_modules/**/*']
      }),
    ],
  };
  
  export default config;