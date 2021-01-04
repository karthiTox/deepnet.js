import * as tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as vertex_ops from './cpu/vertex_ops/vertex_ops_entry';
import { Vertex } from "./Vertex";
import { add, multiply } from "./cpu/tensor_ops/basic";
import { Tensor } from './tensor';
import { isTensor, isVertex } from './checks';

 export function applyfn<arr>(a:Vertex<arr>|Tensor<arr>, act:any, actPrime:any):Vertex<arr>|Tensor<arr>{
    if(isVertex(a)){    
        return vertex_ops.applyfn(a, act, actPrime);
    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, act);   
    }else{
        throw new Error("inputs should be same type");
    }
}