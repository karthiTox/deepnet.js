export {tensor} from './tensor';
export {vertex} from './vertex';
export * from './apply_fn';
export * from './basic';
export * from "./arithmetic";
export * from './mat';
export * from "./cpu/tensor_ops/gen";
export type {avb_rand} from "./util/random"
export * from "./graph";
export * as act from "./util/activation";

import { Tensor } from './tensor';
import { Vertex } from './vertex';
export type return_type<arr> = Tensor<arr> | Vertex<arr>;