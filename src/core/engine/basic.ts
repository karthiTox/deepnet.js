import * as ops_ts from './ops_ts/_ops_entry';
import { tensor } from './tensor';
import { vertex } from './vertex';

export function add<arr>(a:vertex<arr>, b:vertex<arr>):vertex<arr>{
    const res_tensor = ops_ts.add(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

    res.back = ():void => {
        a.grad_ = ops_ts.add(a.grad_, res.grad_);
        b.grad_ = ops_ts.add(b.grad_, res.grad_);        
    }

    return res;
}


export function sub<arr>(a:vertex<arr>, b:vertex<arr>):vertex<arr>{
    const res_tensor = ops_ts.sub(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

    res.back = ():void => {
        a.grad_ = ops_ts.add(a.grad_, res.grad_);        
        
        const res_grad_new = new tensor(
            res.grad_.data.map((v:number) => v * -1),
            res.grad_.shape
        )
        b.grad_ = ops_ts.add(b.grad_, res_grad_new);                
    }

    return res;
}


export function multiply<arr>(a:vertex<arr>, b:vertex<arr>):vertex<arr>{
    const res_tensor = ops_ts.multiply(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

    res.back = ():void => {
        a.grad_ = ops_ts.add(
            a.grad_,
            ops_ts.multiply(res.grad_, b.tensor_)
        );
        b.grad_ = ops_ts.add(
            b.grad_,
            ops_ts.multiply(res.grad_, a.tensor_)
        );
    }

    return res;
}