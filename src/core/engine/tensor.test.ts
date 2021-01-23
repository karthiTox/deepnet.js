import { deepnet } from "./entry";

async function basic_nn(){
    let dn = await deepnet.backends.cpu();
    console.time("test")
    // prime
    let input_tensor = dn.tensor([0, 0, 1, 1, 0, 1, 0, 1, 0, 0], [1, 10]);        
    
    let l1b = deepnet.nn.Linear(dn, 10, 5);
    let l2b = deepnet.nn.Linear(dn, 5, 1);
    
    let l1 = dn.sig(l1b(input_tensor));
    let l2 = dn.sig(l2b(l1)); 
       
    let optim = dn.optimizer.SGD([l1b.weights, l1b.biases, l2b.weights, l2b.biases], 0.04);
    
    for (let i = 0; i < 700; i++) {
        // prime        
        input_tensor.value.data = [0, 0, 1, 1, 0, 1, 0, 1, 0, 0];
        dn.get_output(l2);
        dn.backpass(l2, dn.tensor(l2.value.data.map((v, i)=>v-1), l2.value.shape));                
        optim.step();
        dn.grad_zero(l2);

        // !prime        
        input_tensor.value.data = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1];
        dn.get_output(l2);
        dn.backpass(l2, dn.tensor(l2.value.data.map((v, i)=>v-0), l2.value.shape));                
        optim.step();
        dn.grad_zero(l2);
    }

    input_tensor.value.data = [0, 0, 1, 1, 0, 1, 0, 1, 0, 0];
    dn.get_output(l2);
    l2.value.print();
    
    input_tensor.value.data = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1];
    dn.get_output(l2);
    l2.value.print();
    console.timeEnd("test");
}

async function run() {
    let dn = await deepnet.backends.cpu();    
    let a = dn.tensor([1, 2], [1, 2]);
    let w = dn.tensor([1, 2, 3, 4], [2, 2]);
    let b = dn.tensor([1, 2], [1, 2]);

    let r = dn.matmul(a, dn.transpose(w));    
    let ad = dn.add(r, b);    
    ad.value.print();

    dn.backpass(ad);

    b.grad.print();
    w.grad.print();
    a.grad.print();
}

basic_nn();

// function fully_connected(input:any, weights:any, biases:any){
//     let res1 = dn.matmul(input, dn.transpose(weights));                
//     let res2 = dn.add(res1, biases);
//     let res = dn.sigmoid(res2);

//     return res;
// }  

// function loss(a:any, y:any){
//     return dn.sub(a, y);
// }



// dn.setBackend("WASM").then(() => {
//     dn.tidy(() => {
//         console.time("run time");
//         let w = dn.vertex(dn.rand([5, 2]));
//         let b = dn.vertex(dn.rand([1, 5]));

//         for (let iteration = 0; iteration < 200; iteration++) {
    
//             let a = dn.vertex(dn.ones([1, 2]));
    
//             let result = fully_connected(a, w, b);
//             let output = dn.tensor([0, 1, 0, 1, 0], [1, 5]);
    
//             dn.backpass(result, loss(result.tensor_, output));
//             dn.update_loss(result, 0.04);
//             dn.grad_zero(result);

//         }
    
//         let prediction = fully_connected(dn.ones([1, 2]), w.tensor_, b.tensor_)
//         prediction.print();
//         console.timeEnd("run time");    
//     });    
    
//     console.log(dn.wasm_heap_used())
// })


