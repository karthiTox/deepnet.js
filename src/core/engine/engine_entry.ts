export { tensor } from './tensor';
export { vertex } from './vertex';
export * from './basic';
export { sigmoid, Relu, tanh } from "./apply_fn";
export * from "./arithmetic";
export * from './mat';
export * from "./gen";
export * from "./graph";
export { setBackend } from "./backend";
export { tidy, wasm_heap_used } from "./memory";


import { input } from './input';
export type return_type<arr> = input<arr>;