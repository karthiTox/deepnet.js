import * as ops_cpu from './cpu/_ops_entry';
import * as ops_gpu from './gpu/_entry';
import { settings } from './settings';
import { vertex } from './vertex';

let ops = findOps();

function findOps(){
    switch(settings.mode){
        case "cpu_js" : return ops_cpu
        case "gpu": return ops_gpu
    }
}

export function transpose<ar>(a:vertex<ar>, dim?:number[]){
    const res_tensor = ops.transpose(a.tensor_, dim);
    const res = new vertex(res_tensor, [a]);

    res.back = () => {
        a.grad_ = ops.add(
            a.grad_,
            ops.transpose(res.grad_, dim)
        );
    }

    return res;
}


export function matmul<ar>(a:vertex<ar>, b:vertex<ar>){
    const res_tensor = ops.matmul(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

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

}