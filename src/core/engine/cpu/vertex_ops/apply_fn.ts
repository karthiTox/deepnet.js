import { Vertex } from "../../vertex";
import * as tensor_ops from "../tensor_ops/tensor_ops_entry";

export function applyfn<arr>(a:Vertex<arr>, act:any, actPrime:any):Vertex<arr>{
    const ten = tensor_ops.applyfn(a.tensor_, act);    
    
    const res = new Vertex(
        ten,
        [a]                
    )
    
    res.back = () => {
        a.grad_ = tensor_ops.add(
            a.grad_, 
            tensor_ops.multiply(res.grad_, tensor_ops.applyfn(a.tensor_, actPrime))
        );
    }
    
    return res;
}