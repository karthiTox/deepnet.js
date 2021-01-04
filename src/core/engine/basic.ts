import * as tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as vertex_ops from './cpu/vertex_ops/vertex_ops_entry';

import {Vertex} from "./Vertex";
import {Tensor, tensor} from "./tensor";
import { isTensor, isVertex } from './checks';
import { applyfn } from "./apply_fn";
import { recp } from './arithmetic';

/**
 * Adds two Tensors or Vertex.
 * @param a The first Tensor to add.
 * @param b The Second Tensor to add.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function add<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{    
    if(isVertex(a) && isVertex(b)){
        return vertex_ops.add(a, b);
    }else if(isTensor(a) && isTensor(b)){
        return tensor_ops.add(a, b);        
    }else{
        throw new Error("inputs should be same type");
    }
}

/**
 * Subtracts two Tensors or Vertex.
 * @param a The first Tensor to Subtract.
 * @param b The Second Tensor to Subtract.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function sub<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    if(isVertex(a) && isVertex(b)){
        return vertex_ops.sub(a, b);        
    }else if(isTensor(a) && isTensor(b)){
        return tensor_ops.sub(a, b);        
    }else{
        throw new Error("inputs should be same type");
    }
}

/**
 * Multiplies two Tensors or Vertex.
 * @param a The first Tensor to Multiply.
 * @param b The Second Tensor to Multiply.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function multiply<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    if(isVertex(a) && isVertex(b)){
        return vertex_ops.multiply(a, b);        
    }else if(isTensor(a) && isTensor(b)){
        return tensor_ops.multiply(a, b);        
    }else{
        throw new Error("inputs should be same type");
    }
}


export function divide<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    if(isVertex(a) && isVertex(b)){
        return vertex_ops.multiply(a, vertex_ops.recp(b));        
    }else if(isTensor(a) && isTensor(b)){
        return tensor_ops.multiply(a, tensor_ops.applyfn(b, (z:number)=>1/z));        
    }else{
        throw new Error("inputs should be same type");
    }
}
