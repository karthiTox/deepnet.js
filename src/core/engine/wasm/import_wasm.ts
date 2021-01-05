import Module from './wasm-build/dn_backend_wasm';
export let module = Module;

// export let waiting = Module();
// export let isinitialized = false;


// // browser
// if (typeof window !== 'undefined') {
//   if (Module as any) {
//     setup();
//   }else{
//     console.warn("Wasm is not supported")
//   }
// }

// // node
// if (typeof module !== 'undefined') {
//   setup();
// }

// function setup(){
//   Module().then(wasm:wasm_output)
// }
