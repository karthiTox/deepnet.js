export {tensor} from './tensor';
export {vertex} from './vertex';
export * from './apply_act';
export * from './basic';
export * from "./arithmetic";
export * from './mat';
export * from "./cpu/gen";
export type {avb_rand} from "./cpu/random"
export * from "./graph";
export * as act from "./util/activation";

import { Tensor } from './tensor';
import { Vertex } from './vertex';
export type return_type<arr> = Tensor<arr> | Vertex<arr>;