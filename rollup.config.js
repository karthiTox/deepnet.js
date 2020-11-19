import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { wasm } from '@rollup/plugin-wasm';
import babel from "rollup-plugin-babel";

const extensions = ['.mjs', '.js', '.json', '.node', '.ts'];

const config = {
    input: 'src/layers/net.js',
    external:['gpu.js'],
    output: {
      file: 'test.js',
      format: 'cjs',
      name: 'deep_test',
      globals:{
        "gpu.js":"gpu.js"
      },
    },
    plugins: [
      wasm(), 

      commonjs(), 
      
      resolve({
        preferBuiltins: true,
        browser: false,
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