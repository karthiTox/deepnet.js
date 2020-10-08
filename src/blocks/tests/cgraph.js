const { activation } = require("../../utilities/util");

function node(val){
    this.val = val;
    this.grad = 0;

    this.edges = [];
    for (let i = 1; i < arguments.length; i++) {
        this.edges.push(arguments[i]); // edge
    }
}

function edge(val){
    this.val = val;

    this.nodes = [];
    for (let i = 1; i < arguments.length; i++) {
        this.nodes.push(arguments[i]); // node
    }
}

function add(a = new node(0) , b = new node(0)){
    return new node(a.val + b.val, new edge(1, a), new edge(1, b));
}

function multiply(a = new node(0) , b = new node(0)){
    return new node(a.val * b.val, new edge(b.val, a), new edge(a.val, b));
}

function sig(a = new node(0)){
    return new node(activation.mini().sig(a.val), new edge(activation.mini().sigPrime(a.val), a))
}

function travel(z = new node(1), i = 'val'){
    console.log(z.grad);

    z.edges.forEach(e => {
        // console.log(e.grad);

        e.nodes.forEach(n => {
            travel(n, i)
        })
    })
}

function backpass(z = new node(1), diff = 1){
    z.grad += diff;

    z.edges.forEach(e => {
        e.nodes.forEach(n => {
            backpass(n, e.val * diff)
        })
    })
}

function update_loss(z = new node(1), alpha = 0.04){
    z.val -= z.grad * alpha;

    z.edges.forEach(e => {
        e.nodes.forEach(n => {
            update_loss(n, alpha)
        })
    })
}

function grad_zero(z = new node(1)){
    z.grad = 0;

    z.edges.forEach(e => {
        e.nodes.forEach(n => {
            grad_zero(n)
        })
    })
}

const w = new node(Math.random());
const w1 = new node(Math.random());

const b = new node(Math.random());

function perceptron(input, output){
    const x = new node(input[0]);
    const y = new node(input[1]);
    
    const inter1 = multiply(x, w);
    const inter2 = multiply(y, w1);
    const inter3 = add(inter1, inter2);
    
    const o = add(inter3, b)
    const o2 = sig(o);
    const t = new node(output);
    
    grad_zero(o2)    
    backpass(o2, o2.val - t.val);        
    update_loss(o2);
}

function perceptron_predict(input){
    const x = new node(input[0]);
    const y = new node(input[1]);
    
    const inter1 = multiply(x, w);
    const inter2 = multiply(y, w1);
    const inter3 = add(inter1, inter2);

    const o = add(inter3, b)
    const o2 = sig(o);

    return o2.val
}

for(let i = 0; i < 1000; i++){
    perceptron([1, 1], 0);
    perceptron([0, 0], 1);
}

console.log(
    perceptron_predict([1, 1]),
    perceptron_predict([0, 0]),
)
    

