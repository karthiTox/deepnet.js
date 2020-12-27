import * as engine from "./_entry_engine";
import * as gen from "./cpu/gen";

export const deepnet = {    
    tensor:engine.tensor,
    vertex:engine.vertex,

    generate:gen,

    applyfn:engine.applyfn,

    add:engine.add,
    sub:engine.sub,
    multiply:engine.multiply,
    divide:engine.divide,
    
    matmul:engine.matmul,
    transpose:engine.transpose,
    
    backpass:engine.backpass,
    update_loss:engine.update_loss,
    grad_zero:engine.grad_zero,
    traversal:engine.traversal,
    detach:engine.detach,
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