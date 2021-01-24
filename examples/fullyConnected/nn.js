const deepnet = require("deepnet.js");

basic_nn();

async function basic_nn(){
    let dn = await deepnet.platforms.cpu();

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