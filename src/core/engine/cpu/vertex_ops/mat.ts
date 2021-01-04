import * as tensor_ops from '../tensor_ops/tensor_ops_entry';
import { Tensor } from '../../tensor';
import { Vertex } from "../../Vertex";

export function transpose<arr>(a:Vertex<arr>, dim?:number[]):Vertex<arr>{
    
    const res_tensor = tensor_ops.transpose(a.tensor_, dim);
    const res = new Vertex(res_tensor, [a]);

    res.back = () => {
        a.grad_ = tensor_ops.add(
            a.grad_,
            tensor_ops.transpose(res.grad_, dim)
        );
    }

    return res;
    
}

export function matmul<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{   
    
    const res_tensor = tensor_ops.matmul(a.tensor_, b.tensor_);
    const res = new Vertex(res_tensor, [a, b]);
    
    res.back = () => {
        a.grad_ = tensor_ops.add(
            a.grad_,
            
            tensor_ops.matmul(
                res.grad_, tensor_ops.transpose(b.tensor_)
            )
    
        );
    
        b.grad_ = tensor_ops.add(
            b.grad_,
         
            tensor_ops.matmul(
                tensor_ops.transpose(a.tensor_), res.grad_
            )
    
        );
    }
    
    return res;
    
    
}

export function concat<arr>(a:Vertex<arr>, b:Vertex<arr>, axis:number):Vertex<arr>{   
    
    const res_tensor = tensor_ops.concat(a.tensor_, b.tensor_, axis);
    const res = new Vertex(res_tensor, [a, b]);

    res.back = () => {
        const rato = a.tensor_.shape[axis] / (a.tensor_.shape[axis] + b.tensor_.shape[axis]);
        const [a_res_grad, b_res_grad] = tensor_ops.disjoin(res.grad_, axis, rato);            

        
        a.grad_ = tensor_ops.add(a.grad_, a_res_grad);
        b.grad_ = tensor_ops.add(b.grad_, b_res_grad);
    }

    return res;
            
}