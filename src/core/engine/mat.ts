import { isTensor, isVertex } from './checks';
import * as tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as vertex_ops from './cpu/vertex_ops/vertex_ops_entry';
import { Tensor } from './tensor';
import { Vertex } from "./Vertex";

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
export function transpose<arr>(a:Vertex<arr>|Tensor<arr>, dim?:number[]){
    if(isVertex(a)){
        return vertex_ops.transpose(a, dim);   
    }else if(isTensor(a)){
        return tensor_ops.transpose(a, dim);   
    }else{
        throw new Error("inputs should be same type");
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
export function matmul<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{   
    if(isVertex(a) && isVertex(b)){
        return vertex_ops.matmul(a, b);   
    }else if(isTensor(a) && isTensor(b)){
        return tensor_ops.matmul(a, b);      
    }else{
        throw new Error("inputs should be same type");
    }

}

export function concat<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>, axis:number):Vertex<arr>|Tensor<arr>{   
    if(isVertex(a) && isVertex(b)){
        
        return vertex_ops.concat(a, b, axis);      

    }else if(isTensor(a) && isTensor(b)){
        return tensor_ops.concat(a, b, axis);      
    }else{
        throw new Error("inputs should be same type");
    }

}