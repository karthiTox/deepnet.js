const dn = require("deepnet.js");

function sig(z) {
    return 1.0 / ( 1.0 + Math.exp(-z) )
}

function sigPrime(z) {
    return (1.0 / ( 1.0 + Math.exp(-z) )) * (1 - (1.0 / ( 1.0 + Math.exp(-z) )))
}

function fully_connected(input, weights, biases){
    let res1 = dn.matmul(input, dn.transpose(weights));                
    let res2 = dn.add(res1, biases);
    let res = dn.applyfn(res2, sig, sigPrime);

    return res;
}  

function loss(a, y){
    return dn.sub(a, y);
}

let w = dn.vertex(dn.rand([5, 2]));
let b = dn.vertex(dn.rand([1, 5]));

for (let iteration = 0; iteration < 1000; iteration++) {
    
    
    let a = dn.vertex(dn.ones([1, 2]));
    
    let result = fully_connected(a, w, b);
    let output = dn.tensor([0, 1, 0, 1, 0], [1, 5]);
    
    dn.backpass(result, loss(result.tensor_, output));
    dn.update_loss(result, 0.04);
    dn.grad_zero(result);
    dn.detach(result);

}

let prediction = fully_connected(dn.ones([1, 2]), w.tensor_, b.tensor_)
prediction.print(); // [0, 1, 0, 1, 0]