import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from "rollup-plugin-babel";
import {terser} from "rollup-plugin-terser";
// import { wasm } from '@rollup/plugin-wasm';

const extensions = ['.mjs', '.js', '.json', '.node', '.ts'];
const name = 'deepnet';

const config = {
    input: 'src/core/engine/autograd.ts',    
    output: [
      {
        file: 'dist/'+name+'-browser.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/'+name+'-browser.js',
        format: 'umd',
        name,
        sourcemap: true,
      },
      {
        file: 'dist/'+name+'-browser.min.js',
        format: 'umd',
        name,
        sourcemap: true,
        plugins: [          
          terser(),
        ],
      }
    ],
    plugins: [
      
      resolve({
        preferBuiltins: true,        
        browser:true,
        extensions,
      }), 
      
      commonjs(), 
      
      babel({
        extensions,        
        include: ['src/**/*'],        
        exclude: ['node_modules/**/*']
      }),
    ],
  };
  
  export default config;