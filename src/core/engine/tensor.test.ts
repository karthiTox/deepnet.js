import * as dn from "./engine_entry";

function fully_connected(input:any, weights:any, biases:any){
    let res1 = dn.matmul(input, dn.transpose(weights));                
    let res2 = dn.add(res1, biases);
    let res = dn.sigmoid(res2);

    return res;
}  

function loss(a:any, y:any){
    return dn.sub(a, y);
}



dn.setBackend("WASM").then(() => {
    dn.tidy(() => {
        console.time("run time");
        let w = dn.vertex(dn.rand([5, 2]));
        let b = dn.vertex(dn.rand([1, 5]));

        for (let iteration = 0; iteration < 200; iteration++) {
    
            let a = dn.vertex(dn.ones([1, 2]));
    
            let result = fully_connected(a, w, b);
            let output = dn.tensor([0, 1, 0, 1, 0], [1, 5]);
    
            dn.backpass(result, loss(result.tensor_, output));
            dn.update_loss(result, 0.04);
            dn.grad_zero(result);

        }
    
        let prediction = fully_connected(dn.ones([1, 2]), w.tensor_, b.tensor_)
        prediction.print();
        console.timeEnd("run time");    
    });    
    
    console.log(dn.wasm_heap_used())
})