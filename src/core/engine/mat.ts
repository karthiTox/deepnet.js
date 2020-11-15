import * as ops_ts from './cpu/_ops_entry';
import { vertex } from './vertex';

export function transpose<ar>(a:vertex<ar>, dim?:number[]){
    const res_tensor = ops_ts.transpose(a.tensor_, dim);
    const res = new vertex(res_tensor, [a]);

    res.back = () => {
        a.grad_ = ops_ts.add(
            a.grad_,
            ops_ts.transpose(res.grad_, dim)
        );
    }

    return res;
}


export function matmul<ar>(a:vertex<ar>, b:vertex<ar>){
    const res_tensor = ops_ts.matmul(a.tensor_, b.tensor_);
    const res = new vertex(res_tensor, [a, b]);

    res.back = () => {
        a.grad_ = ops_ts.add(
            a.grad_,
            
            ops_ts.matmul(
                res.grad_, ops_ts.transpose(b.tensor_)
            )

        );

        b.grad_ = ops_ts.add(
            b.grad_,
         
            ops_ts.matmul(
                ops_ts.transpose(a.tensor_), res.grad_
            )

        );
    }

    return res;

}