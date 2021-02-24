import {ops_cpu, Tensor} from "./tensor_ops"

let ops = new ops_cpu();

function feed(a:Tensor<any>, w:Tensor<any>, b:Tensor<any>) {
    let mat_res = ops.matmul(a, w);
    let added = ops.add(mat_res, b);
    return ops.sig(added);
}

test("feed-forword tensor-cpu", ()=>{
    let a = ops.tensor([1, 2, 3, 4], [2, 2]);
    let w = ops.randn([2, 2]);
    let b = ops.randn([2, 2]);
    
    let optm = ops.optimizer.SGD([w, b], 0.04);
    
    for (let i = 0; i < 300; i++) {
        
        let result = feed(a, w, b);
        let loss = ops.sub(result, ops.tensor([0, 1, 0, 1], [2, 2]));              
        
        ops.backpass(result, loss);
        optm.step();
        ops.grad_zero(result);

    }

    let pred = feed(a, w, b);

    expect(pred.value.data.map((a) => Math.round(a))).toStrictEqual([0, 1, 0, 1]);

});