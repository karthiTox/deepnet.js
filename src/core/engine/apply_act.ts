import { applyfn as afn } from './cpu/apply_act'
import { Vertex } from "./Vertex";
import { add, multiply } from "./cpu/basic";
import { Tensor } from './tensor';
import { isTensor, isVertex } from './checks';

 export function applyfn<arr>(a:Vertex<arr>|Tensor<arr>, act:any, actPrime:any):Vertex<arr>|Tensor<arr>{
    if(isVertex(a)){

        const ten = afn(a.tensor_, act);    
    
        const res = new Vertex(
            ten,
            [a]                
        )
    
        res.back = () => {
            a.grad_ = add(
                a.grad_, 
                multiply(res.grad_, afn(a.tensor_, actPrime))
            );
        }
    
        return res;

    }else if(isTensor(a)){
        return afn(a, act);   
    }else{
        throw new Error("inputs should be same type");
    }
}