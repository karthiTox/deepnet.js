import * as cpu_tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as cpu_vertex_ops from './cpu/vertex_ops/vertex_ops_entry';

import * as wasm_tensor_ops from './wasm/tensor_ops/tensor_ops_entry';
import * as wasm_vertex_ops from './wasm/vertex_ops/vertex_ops_entry';

import { current_backend } from './backend';

import { Vertex_types } from "./Vertex";
import { Tensor_types } from "./tensor";
import { isTensor, isTensorView, isVertex, isVertexView } from './checks';

import { input } from "./input"

import { debug_cpu, debug_wasm } from "./logger"

/**
 * Adds two Tensors or Vertex.
 * @param a The first Tensor to add.
 * @param b The Second Tensor to add.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function add<arr>(a:input<arr>, b:input<arr>):input<arr>{    
    
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("added using cpu")
    
            if(isVertex(a) && isVertex(b)){
                return cpu_vertex_ops.add(a, b);
            }else if(isTensor(a) && isTensor(b)){
                return cpu_tensor_ops.add(a, b);        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a) && isVertexView(b)){
                return wasm_vertex_ops.add(a, b);
            }else if(isTensorView(a) && isTensorView(b)){
                return wasm_tensor_ops.add(a, b);        
            }else{
                throw new Error("inputs should be same type");
            }
    }
    
}

/**
 * Subtracts two Tensors or Vertex.
 * @param a The first Tensor to Subtract.
 * @param b The Second Tensor to Subtract.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function sub<arr>(a:input<arr>, b:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("sub using cpu")
    
            if(isVertex(a) && isVertex(b)){
                return cpu_vertex_ops.sub(a, b);
            }else if(isTensor(a) && isTensor(b)){
                return cpu_tensor_ops.sub(a, b);        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("sub using wasm")
    
            if(isVertexView(a) && isVertexView(b)){
                return wasm_vertex_ops.sub(a, b);
            }else if(isTensorView(a) && isTensorView(b)){
                return wasm_tensor_ops.sub(a, b);        
            }else{
                throw new Error("inputs should be same type");
            }
    }
}

/**
 * Multiplies two Tensors or Vertex.
 * @param a The first Tensor to Multiply.
 * @param b The Second Tensor to Multiply.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function multiply<arr>(a:input<arr>, b:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("multiply using cpu")
    
            if(isVertex(a) && isVertex(b)){
                return cpu_vertex_ops.multiply(a, b);
            }else if(isTensor(a) && isTensor(b)){
                return cpu_tensor_ops.multiply(a, b);        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("mul using wasm")
    
            if(isVertexView(a) && isVertexView(b)){
                return wasm_vertex_ops.multiply(a, b);
            }else if(isTensorView(a) && isTensorView(b)){
                return wasm_tensor_ops.multiply(a, b);        
            }else{
                throw new Error("inputs should be same type");
            }
    }
}


export function divide<arr>(a:input<arr>, b:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("divide using cpu")
    
            if(isVertex(a) && isVertex(b)){
                return cpu_vertex_ops.multiply(a, cpu_vertex_ops.recp(b));        
            }else if(isTensor(a) && isTensor(b)){
                return cpu_tensor_ops.multiply(a, cpu_tensor_ops.applyfn(b, (z:number)=>1/z));        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("divide using wasm")
            throw new Error("currently divide method is not available in wasm");            
    }
}
