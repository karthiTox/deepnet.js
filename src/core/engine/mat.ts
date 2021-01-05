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
 * Transposes the Tensor according to the dimension (dim).
 * 
 * this operation is a regular matrix transpose on Tensor.
 * The input Tensor axis will be changed according to the input dimension (dim). 
 *  
 * @param a The input tensor
 * @param dim the input dimension
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 * 
 */
export function transpose<arr>(a:input<arr>, dim?:number[]):input<arr>{
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("transpose cpu")
    
            if(isVertex(a)){
                return cpu_vertex_ops.transpose(a, dim);   
            }else if(isTensor(a)){
                return cpu_tensor_ops.transpose(a, dim);   
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("transpose wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.transpose(a, dim);   
            }else if(isTensorView(a)){
                return wasm_tensor_ops.transpose(a, dim);   
            }else{
                throw new Error("inputs should be same type");
            }
    }
    
}

/**
 * Computes the matrix multiplication of two Tensors
 * @param a The first Tensor to Matmul.
 * @param b The Second Tensor to Matmul.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 * 
 */
export function matmul<arr>(a:input<arr>, b:input<arr>):input<arr>{    
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("matmul cpu")
    
            if(isVertex(a) && isVertex(b)){
                return cpu_vertex_ops.matmul(a, b);   
            }else if(isTensor(a) && isTensor(b)){
                return cpu_tensor_ops.matmul(a, b);      
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("matmul wasm")
    
            if(isVertexView(a) && isVertexView(b)){
                return wasm_vertex_ops.matmul(a, b);   
            }else if(isTensorView(a) && isTensorView(b)){
                return wasm_tensor_ops.matmul(a, b);      
            }else{
                throw new Error("inputs should be same type");
            }
    }
    
    

}

export function concat<arr>(a:input<arr>, b:input<arr>, axis:number):input<arr>{   
    switch (current_backend) {
        default:
        case "CPU":
            debug_cpu.log("concat cpu")
    
            if(isVertex(a) && isVertex(b)){
        
                return cpu_vertex_ops.concat(a, b, axis);      
        
            }else if(isTensor(a) && isTensor(b)){
                return cpu_tensor_ops.concat(a, b, axis);      
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("concat wasm")
    
            throw new Error("currently concat is not available in wasm");
            
    }

}