import * as ops_cpu from './cpu/_ops_entry';
import * as ops_gpu from './gpu/_entry';
import { settings } from './settings';
import { tensor } from './tensor';
import { vertex } from './vertex';

let ops = findOps();

function findOps(){
    switch(settings.mode){
        case "cpu_js" : return ops_cpu
        case "gpu": return ops_gpu
    }
}

export function add<arr>(a:vertex<arr>, b:vertex<arr>):vertex<arr>{
    const res_tensor = ops.add(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

    res.back = ():void => {
        a.grad_ = ops.add(a.grad_, res.grad_);
        b.grad_ = ops.add(b.grad_, res.grad_);        
    }

    return res;
}


export function sub<arr>(a:vertex<arr>, b:vertex<arr>):vertex<arr>{
    const res_tensor = ops.sub(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

    res.back = ():void => {
        a.grad_ = ops.add(a.grad_, res.grad_);        
        
        const res_grad_new = new tensor(
            res.grad_.data.map((v:number) => v * -1),
            res.grad_.shape
        )
        b.grad_ = ops.add(b.grad_, res_grad_new);                
    }

    return res;
}


export function multiply<arr>(a:vertex<arr>, b:vertex<arr>):vertex<arr>{
    const res_tensor = ops.multiply(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

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
}