import * as cpu_tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as cpu_vertex_ops from './cpu/vertex_ops/vertex_ops_entry';

import * as wasm_tensor_ops from './wasm/tensor_ops/tensor_ops_entry';
import * as wasm_vertex_ops from './wasm/vertex_ops/vertex_ops_entry';

import * as act from "./util/activation"

import { current_backend } from './backend';

import { Vertex, Vertex_types } from "./Vertex";
import { Tensor, Tensor_types } from "./tensor";
import { isTensor, isTensorView, isVertex, isVertexView } from './checks';

import { input } from "./input"

import { debug_cpu, debug_wasm } from "./logger"

export function applyfn<arr>(a:Tensor<arr>|Vertex<arr>, fn:(...arg:any[])=>number, delta?:(...arg:any[])=>number):Tensor<arr>|Vertex<arr>{
    if(isVertex(a)){    
        if(delta) 
            return cpu_vertex_ops.applyfn(a, fn, delta);
        else 
            throw new Error("delta value should pass");
    }else if(isTensor(a)){
        return cpu_tensor_ops.applyfn(a, fn);   
    }else{
        throw new Error("inputs should be same type");
    }
}

export function sigmoid<arr>(a:input<arr>):input<arr>{
    switch (current_backend) {
        default:
        case "CPU":
            if(isVertex(a)){    
                return cpu_vertex_ops.applyfn(a, act.sig, act.sigPrime);
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, act.sig);   
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 1);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 1);        
            }else{
                throw new Error("inputs should be same type");
            }
    }
}


export function Relu<arr>(a:input<arr>):input<arr>{
    switch (current_backend) {
        default:
        case "CPU":
            if(isVertex(a)){    
                return cpu_vertex_ops.applyfn(a, act.reLU, act.reLUprime);
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, act.reLU);   
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 3);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 3);        
            }else{
                throw new Error("inputs should be same type");
            }
    }
}


export function tanh<arr>(a:input<arr>):input<arr>{
    switch (current_backend) {
        default:
        case "CPU":
            if(isVertex(a)){    
                return cpu_vertex_ops.applyfn(a, act.tanh, act.tanhPrime);
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, act.tanh);   
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 2);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 2);        
            }else{
                throw new Error("inputs should be same type");
            }
    }
}