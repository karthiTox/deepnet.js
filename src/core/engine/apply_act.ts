import { apply_activation as ap_act } from './cpu/apply_act'
import { vertex } from "./vertex";
import { add, multiply } from "./cpu/basic";

 export function apply_activation<arr>(a:vertex<arr>, act:any, actPrime:any){
    const ten = ap_act(a.tensor_, act);    

    const res = new vertex(
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
}