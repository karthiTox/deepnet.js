const { activation } = require("../../utilities/util");

class tensor{
    constructor(val, shape){
        this.val = val;        
        this.shape = shape ? shape : this.findshape(val);
        this.val = this.extract(val);
        this.rank = this.shape.length;        
    }

    findshape(mat) {
        if(Array.isArray(mat)){
            const shape = [];
            shape.push(mat.length);
            this.findshape(mat[0]).forEach(v => {
                shape.push(v)
            });
            return shape;
        }else{        
            return []
        }
    }

    extract(mat){
        if(Array.isArray(mat)){
            const elements = [];        
            mat.forEach(m => {
                this.extract(m).forEach(v => {
                    elements.push(v)
                });
            })
            return elements;
        }else{        
            return [mat]
        }
    }

    build(shape = this.shape, val = this.val) {        
        const res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(
                shape.length == 1 
                    ? val[s] 
                    : this.build(
                        shape.slice(1), 
                        val.slice(s * Math.floor(val.length/shape[0]), s * Math.floor(val.length/shape[0]) + shape.slice(1).reduce((a, b) => a*b))
                    )
            );
        }
        return res
    }
}

class node extends tensor{
    constructor(val, shape, edges = []){
        super(val, shape);

        this.grad = new tensor(this.val.map(v => 0), this.shape);
        this.edges = [];
        for (let i = 2; i < arguments.length; i++) {
            this.edges.push(arguments[i]); // edge
        }
    }
}


class edge extends tensor{
    constructor(val, shape, operation, nodes){
        super(val, shape);

        this.operation = operation ? operation : (e, diff) => { return Nmul(e, diff) };
        this.pointers = [];
        for (let i = 3; i < arguments.length; i++) {
            this.pointers.push(arguments[i]); // node
        }
    }
}

function travel(z, propToPrint = 'component', edge = false){
    console.log(z[propToPrint]);

    z.edges.forEach(e => {
        edge ? console.log(e[propToPrint], "<== edge") : edge;

        e.pointers.forEach(n => {
            travel(n, propToPrint, edge)
        })
    })
}

function backpass(z, diff){
    z.grad = Nadd(z.grad, diff);

    z.edges.forEach(e => {
        e.pointers.forEach(n => {
            backpass(n, e.operation(e, diff))
        })
    })
}

function update_loss(z = new node(1), alpha = 0.04){
    // z.component -= z.grad * alpha;
    z.val = z.val.map((a, i) => a - (z.grad.val[i] * alpha))

    z.edges.forEach(e => {
        e.pointers.forEach(n => {
            update_loss(n, alpha)
        })
    })
}


function Nadd(a, b){
    return new tensor(
        a.val.map((a, i) => a + b.val[i]), 
        a.shape,         
    )
}

function Nsub(a, b){
    return new tensor(
        a.val.map((a, i) => a - b.val[i]), 
        a.shape,         
    )
}


function Nmul(a, b){
    return new tensor(
        a.val.map((a, i) => a * b.val[i]), 
        a.shape, 
    )
}

function add(a, b){
    return new node(
        a.val.map((a, i) => a + b.val[i]), 
        a.shape, 
        new edge(new Array(a.val.length).fill(1), null, null, a),
        new edge(new Array(a.val.length).fill(1), null, null, b),
    )
}


function mul(a, b){
    return new node(
        a.val.map((a, i) => a * b.val[i]), 
        a.shape, 
        new edge(b.val, null, null, a),
        new edge(a.val, null, null, b),
    )
}

function dot(a, b){
    return a.map((a, i) => a * b[i]).reduce((a, b) => a + b)
}

function incre(ten, times){
    arr = []
    for (let t = 0; t < times; t++) {
        arr.push(ten.val.map(v => v))        
    }
    return new tensor ( arr, [ten.shape[0] * times-1, ten.shape[1]] )
}

// not efficient algorithm
function matmul_iternal_2x2(a, b){
    let res = [];
    for(let r = 0; r < a.length; r++){
        res[r] = [];
        for(let c = 0; c < b[r].length; c++){
            let sum = 0;
            for(let k = 0; k < a[r].length; k++){                        
                sum += a[r][k] * b[k][c];
            }
            res[r][c] = sum
        }
    }

    return res;
}

function transpose_internal_2x2(A=[[1, 2], [1, 2]]){
    let res = genEmptyMatrix(A[0].length, A.length)        
    for(let r = 0; r < res.length; r++){
        for(let c = 0; c < res[r].length; c++){                                                              
            res[r][c] = A[c][r];
        }
    }
    return res
}

function genEmptyMatrix(row, column){
    let res = [];
    for(let r = 0; r < row; r++){
        res[r] = []
        for(let c = 0; c < column; c++){
            res[r][c] = 0
        }
    }
    return res
}

function transpose_internal_1(a){
    if(typeof(a[0][0]) == 'number'){
        return transpose_internal_2x2(a);
    }else{       
        const res = [];
        a.forEach((a, i) => {
            res[i] = transposev2(a);
        })
        return res;
    }
}

function transpose(a){
    let res = transpose_internal_1(a.build())
    return new tensor(res)
}

function matmul_internal_1(a, b){
    if(typeof(a[0][0]) == 'number'){
        return matmul_iternal_2x2(a, b);
    }else{       
        const res = [];
        a.forEach((a, i) => {
            res[i] = matmul_internal_1(a, b[i]);
        })
        return res;
    }
}

function matmul(a, b, type){
    let res = matmul_internal_1(a.build(), b.build())      

    return type == 'normal' 
        ? new tensor(res)
        : new node(
            res,
            null,
            new edge(transpose_internal_1(b.build()), null, (e, diff) => { return matmul(diff, e, 'normal') }, a),        
            new edge(
                a.val,
                a.shape,                
                (edge_v, diff) => {
                    const mat = []      
                    diff.val.forEach(di => {
                        mat.push(edge_v.val.map(v => v * di))
                    })
                    
                    return transpose(new tensor(mat, [diff.val.length, edge_v.val.length]))
                }, 
                b
            )
        )
}

function sig(a){
    return new node(
        a.val.map(v => activation.mini().sig(v)),
        a.shape,
        new edge(
            a.val.map(v => activation.mini().sigPrime(v)),
            a.shape,
            null,
            a
        )
    )
}


function geneye(val){        
    let arr = new Array(val.length * val.length).fill(0)        
    val.forEach((element, i) => {
       arr[i * val.length + i] = element
    });
    return new tensor(
        arr, 
        [val.length, val.length]
    )
}

let b = new node([Math.random(), Math.random()], [2, 1]);

function run(){
    let a = new node([0, 0], [1, 2]);
    let res = matmul(a, b);
    let res2 = sig(res)    
    backpass(res2, new tensor([res2.val[0] - 1], [1, 1]))
    update_loss(res2, 0.04)

    
    a = null;
    res = null;

    
    // a = new node([1, 1], [1, 2]);
    // res = matmul(a, b);
    // res2 = sig(res)    
    // backpass(res2, new tensor([res2.val[0] - 1], [1, 1]))
    // update_loss(res2, 0.04) 
    
    

    a = null;
    res = null;
}

function predict(){  
    
    let a = new node([0, 0], [1, 2]);
    let res = sig(matmul(a, b));
    console.log(res.val)

    
    a = null;
    res= null;
    b = null;
}

for(let i = 0; i < 1000; i++){
    run()
}

predict()
