import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from "rollup-plugin-babel";
import { wasm } from '@rollup/plugin-wasm';
import { copyto } from "./rollup-plugin-copy-to";

const extensions = ['.mjs', '.js', '.json', '.node', '.ts'];
const name = 'deepnet';

let entry = 'src/core/engine/tensor.test.ts'

const config = {
    input: entry,    
    output: [
      {
        file: "./dist_test/test.js",
        format: 'cjs',
      }
    ],
    plugins: [
      wasm(),
      
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

      // copyto("./src/core/engine/wasm/wasm-build/ems.wasm", "./dist_test/")
    ],
  };
  
  export default config;