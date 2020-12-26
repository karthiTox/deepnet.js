import { add, multiply, sub } from "./basic";
import { matmul, transpose } from "./mat";
import * as graphfn from "./graph";
import { tensor } from "./tensor";
import { vertex } from "./vertex";
import * as genfn from "./cpu/gen";
import { apply_activation } from "./apply_act";

export const deepnet = {    
    tensor:tensor,
    vertex:vertex,

    rand:genfn.rand,
    ones:genfn.ones,
    zeros:genfn.zeros,
    fill:genfn.fill,
    fillfn:genfn.fillfn,

    applyfn:apply_activation,

    add:add,
    sub:sub,
    multiply:multiply,
    matmul:matmul,
    transpose:transpose,
    
    backpass:graphfn.backpass,
    update_loss:graphfn.update_loss,
    grad_zero:graphfn.grad_zero,
    traversal:graphfn.traversal,
    detach:graphfn.detach,
}

declare global {
    interface Window {
        deepnet: typeof deepnet;
    }
}
  
if (typeof window !== 'undefined') {
    window.deepnet = deepnet;
}
  
if (typeof module !== 'undefined') {
    module.exports = deepnet;
}