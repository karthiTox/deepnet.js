const narray = require('./n-array');

const narray_fn = require('./n-array.fn')
// const ngraph = require('./n-graph.fn')

// const ngraph_fn = ngraph.ngraph
// const node = ngraph.node;
// const edge = ngraph.edge;

function intitalize(){
    const fn = new ngraph_fn();
    const w = new node([Math.random(), Math.random()], [2, 1]);
    const b = new node([Math.random()], [1, 1]);
}

function run(){
    let a = new node([1, 1], [1, 2]);    
    let res = fn.sig(fn.add(fn.matmul(a, w), b))
    
    fn.backpass(res, new narray([res.val[0] - 0], [1, 1]))
    fn.update_loss(res, 0.04) 
    
    

    a = new node([0, 0], [1, 2]);    
    res = fn.sig(fn.add(fn.matmul(a, w), b))
    
    fn.backpass(res, new narray([res.val[0] - 1], [1, 1]))
    fn.update_loss(res, 0.04)
}

function predict(){
    let a = new node([1, 1], [1, 2]);    
    let res = fn.sig(fn.add(fn.matmul(a, w), b))
    console.log(res.val)


    a = new node([0, 0], [1, 2]);    
    res = fn.sig(fn.add(fn.matmul(a, w), b))
    console.log(res.val)
}

function cstep(shape = []){
    if(shape.length > 1){
        const current_shape = [shape.slice(1).reduce((a, b) => a * b)]
        return current_shape.concat(cstep(shape.slice(1)))
    }else{
        return [1]
    }
}

function cstep_change(step = [], dimension = []){    
    if(dimension.length > 0){
        const currentstate = [step[dimension[0]]]
        return currentstate.concat(cstep_change(step, dimension.slice(1)))
    }else{
        return []
    }
}

function cindex(index = [], step = []){
    if(index.length > 0){
        const current_index = index[0] * step[0];
        return current_index + cindex(index.slice(1), step.slice(1))
    }else{
        return 0
    }
}

function transpose(a, dimension = [], shape = cstep_change(a.shape, dimension), len = shape.length, step = cstep_change(cstep(a.shape), dimension), index = []){            
    const arr = []
    for (let s = 0; s < (shape[0] || 0); s++) {        
        const copy = index.concat([s])
        transpose(a, dimension, shape.slice(1), len, step, copy).forEach(el => {
            arr.push(el)
        });
    }
    if(index.length == len){         
        return [a.val[cindex(index, step)]]
    }
    return arr
}

function matmul(a, b_){  
    let col_step = a.shape[a.shape.length - 1];
    let b = transpose(b_, b_.shape.map((a, i) => i).reverse());
    let res = []
    for (let r = 0; r < a.val.length / col_step; r++) {
        
        for(let c = 0; c < b_.shape[b_.shape.length - 1]; c++){
            const a_m = a.val.slice(r * col_step, r * col_step + col_step);
            const b_m = b.slice(c * col_step, c * col_step + col_step);

            res.push(a_m.map((a, i) => a * b_m[i]).reduce((a, b) => a + b))
        }
    }
    return res
}

function split(a, b){
    let a_shape = [a.shape[a.shape.length - 2], a.shape[a.shape.length - 1]];
    let b_shape = [b.shape[b.shape.length - 2], b.shape[b.shape.length - 1]];

    let tot_el_a = a_shape[0] * a_shape[1];
    let tot_el_b = b_shape[0] * b_shape[1];

    res = [];

    for (let i = 0; i < a.val.length / tot_el_a; i++) {       
        matmul(
            new narray(a.val.slice(i * tot_el_a, i * tot_el_a + tot_el_a), a_shape),
            new narray(b.val.slice(i * tot_el_b, i * tot_el_b + tot_el_b), b_shape)
        ).forEach(v => res.push(v))                                      
    }

    return res;
}

function test(){  
    const fn = new narray_fn()
    const a = new narray([1, 2, 3, 4, 5, 6, 7, 8], [2, 1, 2])
    const b = new narray([1, 2, 3, 4, 5, 6, 7, 8], [2, 2, 1])
    console.log(
        fn.matmul(a, b),        
    )
}

test()