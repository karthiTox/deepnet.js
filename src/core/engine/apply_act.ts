import { apply_activation as ap_act } from './cpu/apply_act'
import { Vertex } from "./Vertex";
import { add, multiply } from "./cpu/basic";
import { Tensor } from './tensor';
import { isTensor, isVertex } from './checks';

 export function apply_activation<arr>(a:Vertex<arr>|Tensor<arr>, act:any, actPrime:any):Vertex<arr>|Tensor<arr>{
    if(isVertex(a)){

        const ten = ap_act(a.tensor_, act);    
    
        const res = new Vertex(
            ten,
            [a]                
        )
    
        res.back = () => {
            a.grad_ = add(
                a.grad_, 
                multiply(res.grad_, ap_act(a.tensor_, actPrime))
            );
        }
    
        return res;

    }else if(isTensor(a)){
        return ap_act(a, act);   
    }else{
        throw new Error("inputs should be same type");
    }
}