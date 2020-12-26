import { add, multiply, sub } from "./basic";
import { matmul, transpose } from "./mat";
import * as graphfn from "./graph";
import { tensor } from "./tensor";
import { vertex } from "./vertex";
import * as genfn from "./cpu/gen";

module.exports = {    
    tensor:tensor,
    vertex:vertex,

    rand:genfn.rand,
    ones:genfn.ones,
    zeros:genfn.zeros,
    fill:genfn.fill,
    fillfn:genfn.fillfn,

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