import * as ops from './cpu/_ops_entry';
import {Vertex} from "./Vertex";
import {Tensor, tensor} from "./tensor";
import { isTensor, isVertex } from './checks';

/**
 * Adds two Tensors or Vertex.
 * @param a The first Tensor to add.
 * @param b The Second Tensor to add.
 * 
 * @returns Tensor if inputs are Tensor, Vertex if inputs are Vertex 
 */
export function add<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{    
    if(isVertex(a) && isVertex(b)){
        const res_tensor = ops.add(a.tensor_, b.tensor_);
        const res = new Vertex(res_tensor, [a, b]);
    
        res.back = ():void => {
            a.grad_ = ops.add(a.grad_, res.grad_);
            b.grad_ = ops.add(b.grad_, res.grad_);        
        }
    
        return res;
    }else if(isTensor(a) && isTensor(b)){
        return ops.add(a, b);        
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
        const res_tensor = ops.sub(a.tensor_, b.tensor_);
        const res = new Vertex(res_tensor, [a, b]);
    
        res.back = ():void => {
            a.grad_ = ops.add(a.grad_, res.grad_);        
            
            const res_grad_new = tensor(
                res.grad_.data.map((v:number) => v * -1),
                res.grad_.shape
            )
            b.grad_ = ops.add(b.grad_, res_grad_new);                
        }
    
        return res;
    }else if(isTensor(a) && isTensor(b)){
        return ops.sub(a, b);        
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
        const res_tensor = ops.multiply(a.tensor_, b.tensor_);
        const res = new Vertex(res_tensor, [a, b]);
    
        res.back = ():void => {
            a.grad_ = ops.add(
                a.grad_,
                ops.multiply(res.grad_, b.tensor_)
            );
            b.grad_ = ops.add(
                b.grad_,
                ops.multiply(res.grad_, a.tensor_)
            );
        }
    
        return res;
    }else if(isTensor(a) && isTensor(b)){
        return ops.multiply(a, b);        
    }else{
        throw new Error("inputs should be same type");
    }
}