import { isTensor, isVertex } from './checks';
import * as ops from './cpu/_ops_entry';
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
        const res_tensor = ops.transpose(a.tensor_, dim);
        const res = new Vertex(res_tensor, [a]);
    
        res.back = () => {
            a.grad_ = ops.add(
                a.grad_,
                ops.transpose(res.grad_, dim)
            );
        }
    
        return res;
    }else if(isTensor(a)){
        return ops.transpose(a, dim);   
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
        
        const res_tensor = ops.matmul(a.tensor_, b.tensor_);
        const res = new Vertex(res_tensor, [a, b]);
    
        res.back = () => {
            a.grad_ = ops.add(
                a.grad_,
                
                ops.matmul(
                    res.grad_, ops.transpose(b.tensor_)
                )
    
            );
    
            b.grad_ = ops.add(
                b.grad_,
             
                ops.matmul(
                    ops.transpose(a.tensor_), res.grad_
                )
    
            );
        }

        return res;

    }else if(isTensor(a) && isTensor(b)){
        return ops.matmul(a, b);      
    }else{
        throw new Error("inputs should be same type");
    }

}