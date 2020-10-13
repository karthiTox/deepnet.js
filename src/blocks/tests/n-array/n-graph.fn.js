const narray = require('./n-array');
const narray_fn = require('./n-array.fn');
const { activation } = require("../../../utilities/util");

class node extends narray{
    constructor(val, shape, edges = []){
        super(val, shape);

        this.grad = new narray(this.val.map(v => 0), this.shape)
        this.edges = [];
        for (let i = 2; i < arguments.length; i++) {
            this.edges.push(arguments[i]); // edge
        }
    }
}

class edge extends narray{
    constructor(val, shape, operation, nodes){
        super(val, shape);

        this.operation = operation;
        this.pointers = [];
        for (let i = 3; i < arguments.length; i++) {
            this.pointers.push(arguments[i]); // node
        }
    }
}

class ngraph extends narray_fn{
    constructor() { super() }

    multiply_internal(edge_val, diff) { return super.multiply(edge_val, diff) }
    
    add(a, b){
        const res = super.add(a, b)
        return new node(
            res.val, 
            res.shape, 
            new edge(new Array(a.val.length).fill(1), a.shape, this.multiply_internal, a),
            new edge(new Array(b.val.length).fill(1), b.shape, this.multiply_internal, b),
        )
    }
    
    sub(a, b){
        const res = super.sub(a, b)
        return new node(
            res.val, 
            res.shape, 
            new edge(new Array(a.val.length).fill(1), a.shape, this.multiply_internal, a),
            new edge(new Array(b.val.length).fill(-1), b.shape, this.multiply_internal, b),
        )
    }
    
    
    multiply(a, b){
        const res = super.multiply(a, b)
        return new node(
            res.val, 
            res.shape, 
            new edge(b.val, b.shape, this.multiply_internal, a),
            new edge(a.val, a.shape, this.multiply_internal, b),
        )
    }

    transpose(a){
        const res = super.transpose(a);
        return new node(
            res.val, 
            res.shape, 
            new edge(
                null, [], 
                (edge_value, diff) => {
                    return super.transpose(diff)
                }, 
                a
            ),            
        )
    }

    
    
    matmul(a, b){
        let res = super.matmul(a, b)      
        
        return new node(
            res.val,
            res.shape,
            new edge(super.transpose_internal_1(b.build()), null, (edge_value, diff) => { return super.matmul(diff, edge_value) }, a),        
            new edge(
                super.transpose_internal_1(a.build()),
                null,    
                (edge_value, diff) => {return super.matmul(edge_value, diff)}, b)
        )
    }

    sig(a){
        return new node(
            a.val.map(v => activation.mini().sig(v)),
            a.shape,
            new edge(
                a.val.map(v => activation.mini().sigPrime(v)),
                a.shape,
                this.multiply_internal,
                a
            )
        )
    }
    
    travel(z, propToPrint = 'component', edge = false){
        console.log(z[propToPrint]);
        
        z.edges.forEach(e => {
            edge ? console.log(e[propToPrint], "<== edge") : edge;
        
            e.pointers.forEach(n => {
                this.travel(n, propToPrint, edge)
            })
        })
    }
        
    backpass(z, diff){        
        z.grad = super.add(z.grad, diff);
        
        z.edges.forEach(e => {
            e.pointers.forEach(n => {
                this.backpass(n, e.operation(e, diff))
            })
        })
    }

    update_loss(z = new node(1), alpha = 0.04){        
        z.val = z.val.map((a, i) => a - (z.grad.val[i] * alpha))
    
        z.edges.forEach(e => {
            e.pointers.forEach(n => {
                this.update_loss(n, alpha)
            })
        })
    }

}


module.exports = {
    node: node,
    edge: edge,
    ngraph: ngraph
} 