import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
// import { wasm } from '@rollup/plugin-wasm';
import babel from "rollup-plugin-babel";

const extensions = ['.mjs', '.js', '.json', '.node', '.ts'];

const config = {
    input: 'src/core/engine/autograd.ts',    
    output: [
      {
        file: 'dist/deepnet.cjs.js',
        format: 'cjs',     
      },
      {
        file: 'dist/deepnet.esm.js',
        format: 'esm',
        name: 'dn',      
      },
      {
        file: 'dist/deepnet.umd.js',
        format: 'umd',
        name: 'dn',      
      }
    ],
    plugins: [
      commonjs(), 
      
      resolve({
        preferBuiltins: true,        
        extensions,
      }),,  
      
      babel({
        extensions,        
        include: ['src/**/*'],
        exclude: ['node_modules/**/*']
      }),
    ],
  };
  
  export default config;