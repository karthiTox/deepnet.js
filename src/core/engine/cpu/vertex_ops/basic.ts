import * as tensor_ops from "../tensor_ops/tensor_ops_entry";
import { Vertex } from '../../vertex';
import { Tensor } from "../../tensor";

export function add<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{    
    
    const res_tensor = tensor_ops.add(a.tensor_, b.tensor_);
    const res = new Vertex(res_tensor, [a, b]);
    
    res.back = ():void => {
        a.grad_ = tensor_ops.add(a.grad_, res.grad_);
        b.grad_ = tensor_ops.add(b.grad_, res.grad_);        
    }
    
    return res;
    
}

export function sub<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{  
    
    const res_tensor = tensor_ops.sub(a.tensor_, b.tensor_);
    const res = new Vertex(res_tensor, [a, b]);
    
    res.back = ():void => {
        a.grad_ = tensor_ops.add(a.grad_, res.grad_);        
        
        const res_grad_new = new Tensor(
            res.grad_.data.map((v:number) => v * -1),
            res.grad_.shape
        )
    
        b.grad_ = tensor_ops.add(b.grad_, res_grad_new);                
    }
    
    return res;

}

export function multiply<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{  
    
    const res_tensor = tensor_ops.multiply(a.tensor_, b.tensor_);
    const res = new Vertex(res_tensor, [a, b]);
    
    res.back = ():void => {
        a.grad_ = tensor_ops.add(
            a.grad_,
            tensor_ops.multiply(res.grad_, b.tensor_)
        );
        b.grad_ = tensor_ops.add(
            b.grad_,
            tensor_ops.multiply(res.grad_, a.tensor_)
        );
    }
    
    return res;

}