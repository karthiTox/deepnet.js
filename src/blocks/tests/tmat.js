class tensorfn{    
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
 
    ndArrayOne(shape = [4]) {
        console.log(shape, val)
        let res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(shape.length <= 1 ? 1 : this.gen(shape.slice(1)));
        }
        return res
    }

    ndArrayZero(shape = [4]) {
        console.log(shape, val)
        let res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(shape.length <= 0 ? 1 : this.gen(shape.slice(1)));
        }
        return res
    }

    genOne(shape){        
        return new tensor(new Array(shape.reduce((a, b) => a * b)).fill(1), shape)
    }

    genZero(shape){        
        return new tensor(new Array(shape.reduce((a, b) => a * b)).fill(0), shape)
    }

    build(shape = [], val = []) {
        if(!Array.isArray(val)) return val
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

    // operations 

    transpose2d(a){
        let res = [];
        const s = a.shape.slice(a.shape.length - 2);
        const r = s[0];
        const c = s[1];

        for (let i = 0; i < r; i++) {
            a.val.slice(i * c, i * c + c).forEach((component, index) => {
                res[index * c + i] = component;
            })
        }    
        res = res.filter((el) => {
            return el != null;
        })
        
        let new_Shape = a.shape;
        let temp = new_Shape[new_Shape.length - 2];        
        new_Shape[new_Shape.length - 2] = new_Shape[new_Shape.length - 1];
        new_Shape[new_Shape.length - 1] = temp
        
        return new tensor(res, new_Shape, a.dtype)    
    }

    transpose(a){                
        const total = a.shape.slice(0, a.shape.length - 2).reduce((a, b) => a * b);
        const matshape = a.shape.slice(a.shape.length - 2);
        const len = matshape.reduce((a, b) => a * b);
        let result = []        
        for (let c = 0; c < total; c++) {            
            result = result.concat(
                this.transpose2d(
                    new tensor(a.val.slice(c * len, c * len + len), matshape)
                ).val
            );
        }
        
        let new_Shape = a.shape;
        let temp = new_Shape[new_Shape.length - 2];        
        new_Shape[new_Shape.length - 2] = new_Shape[new_Shape.length - 1];
        new_Shape[new_Shape.length - 1] = temp
        return new tensor(result, new_Shape, a.dtype)
    }

    add(a, b){
        if(a.rank == b.rank){
            if(a.rank == 0){
                return new tensor(a.val + b.val);
            }
            return new tensor(a.val.map((a, i) => a + b.val[i]));
        }

        return a;
    }

    test(a, b, type = 'add'){
        let tensor_a = a.component
        let tensor_b = b.component

        if(tensor_a.rank == tensor_b.rank){
            if(tensor_a.rank == 0){
                return new node(
                    new tensor(
                        type == 'add' 
                        ? tensor_a.val + tensor_b.val 
                        : 
                        type == 'multiply'
                        ? tensor_a.val * tensor_b.val 
                        : 0
                        ),
                    new edge(tensor_b, a),
                    new edge(tensor_a, b),
                )
            }
            return new node(
                new tensor(
                    type == 'add'         
                        ? tensor_a.val.map((a, i) => a + tensor_b.val[i])
                        : 
                        type == 'multiply'
                        ? tensor_a.val.map((a, i) => a * tensor_b.val[i])
                        : 0),
                new edge(tensor_b, a),
                new edge(tensor_a, b),
            )
        }       
    }
    
    multiply(a, b){
        let tensor_a = a.component
        let tensor_b = b.component

        if(tensor_a.rank == tensor_b.rank){
            if(tensor_a.rank == 0){
                return new node(
                    new tensor(tensor_a.val * tensor_b.val),
                    new edge(tensor_b, a),
                    new edge(tensor_a, b),
                )
            }
            return new node(
                new tensor(tensor_a.val.map((a, i) => a * tensor_b.val[i])),                
                new edge(tensor_b, a),
                new edge(tensor_a, b),
            )
        }       
    }

    sub(a, b){
        if(a.rank == b.rank){
            if(a.rank == 0){
                return new tensor(a.val - b.val);
            }
            return new tensor(a.val.map((a, i) => a - b.val[i]));
        }

        return a;
    }

}

class tensor{
    constructor(val, shape, dtype){
        if(typeof(val) == 'number'){
            this.val = val
            this.shape = [];
            this.rank = 0;
            this.dtype = dtype == 'float' ? 'float' : 'int';
        }else{            
            this.val = [];
            this.shape = shape ? shape : this.findshape(val);
            this.val = this.extract(val)
            this.rank = this.shape.length;
            this.dtype = dtype == 'float' ? 'float' : 'int';
        }        
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

    toString(){
        // build and return 
        return JSON.stringify(this.val)
    }

    axes(index){        
        const shape = this.shape[0];
        const start = this.val.length / shape;
        return new tensor(Array.from(this.val.slice(index * start, index * start + start)), this.shape.slice(1), this.dtype);                  
    }
}

class node{
    constructor(val){
        this.component = val;
        this.grad = new node(new tensor(this.component.val.map(v => 0)));
        this.edges = [];
        for (let i = 1; i < arguments.length; i++) {
            this.edges.push(arguments[i]); // edge
        }
    }
}

class edge{
    constructor(val){
        this.component = val;

        this.nodes = [];
        for (let i = 1; i < arguments.length; i++) {
            this.nodes.push(arguments[i]); // node
        }
    }
}

class cgraph extends tensorfn{
    travel(z = new node(1), propToPrint = 'component', edge = false){
        console.log(z[propToPrint]);
    
        z.edges.forEach(e => {
            edge ? console.log(e[propToPrint], "<== edge") : edge;
    
            e.nodes.forEach(n => {
                this.travel(n, propToPrint)
            })
        })
    }
    
    backpass(z = new node(1), diff = new node(1)){
        z.grad = this.test(z.grad, diff, 'add');
    
        z.edges.forEach(e => {
            e.nodes.forEach(n => {
                this.backpass(n, this.test(e.component, diff, 'multiply'))
            })
        })
    }
    
    update_loss(z = new node(1), alpha = 0.04){
        z.component -= z.grad * alpha;
    
        z.edges.forEach(e => {
            e.nodes.forEach(n => {
                this.update_loss(n, alpha)
            })
        })
    }
    
    grad_zero(z = new node(1)){
        z.grad = 0;
    
        z.edges.forEach(e => {
            e.nodes.forEach(n => {
                this.grad_zero(n)
            })
        })
    }
}

function test(){
    const cg = new cgraph()
    const tenfn = new tensorfn()
    const a = new node(new tensor([1]));
    const b = new node(new tensor([2]));
    const result = tenfn.multiply(a, b)

    cg.travel(result)
    cg.backpass(result, new tensor(result.component.val.map(v => 1)))
    console.log("test----------")
    cg.travel(result)
}

test()

// function tmat(val){
//     this.val = val;
//     this.shape = findshape(val);
//     this.rank = this.shape.length;
// }

// function dot(a, b){
//     let res = [];

//     if(a.rank == 1 && b.rank == 1){
//         if(a.val.length > b.val.length){
//             res = a.val.map((a, i) => a * (b.val[i] || 1))
//         }else{
//             res = b.val.map((b, i) => b * (a.val[i] || 1))
//         }
//     }

//     return res.reduce((a, b) => a + b)
// }

// // not efficient algorithm
// function matmul_2x2(a, b){
//     let res = [];
//     for(let r = 0; r < a.val.length; r++){
//         res[r] = [];
//         for(let c = 0; c < b.val[r].length; c++){
//             let sum = 0;
//             for(let k = 0; k < a.val[r].length; k++){                        
//                 sum += a.val[r][k] * b.val[k][c];
//             }
//             res[r][c] = sum
//         }
//     }

//     return res;
// }

// function matmul(a, b){
//     if(a.rank <= 2){
//         return matmul_2x2(a, b);
//     }else{       
//         const res = [];
//         a.val.forEach((a, i) => {
//             res[i] = matmul(new tmat(a), new tmat(b.val[i]));
//         })
//         return res;
//     }
// }

// function reshape(mat, shape) {
//     let res = gen(shape)
// }

// function extract(mat = [1, 2]){
//     if(Array.isArray(mat)){
//         const elements = [];        
//         mat.forEach(m => {
//             get_elments(m).forEach(v => {
//                 elements.push(v)
//             });
//         })
//         return elements;
//     }else{        
//         return [mat]
//     }
// }

// function gen(shape = [2]) {
//     let res = []
//     for (let s = 0; s < shape[0]; s++) {
//         res.push(shape.length == 1 ? 1 : gen(shape.slice(1)));
//     }
//     return res
// }




// const i = new tmat(
//     [[
//         [
//         [
//             [ [1, 2],[1, 5] ],
//             [ [1, 3],[1, 5] ],
//             [ [1, 2],[1, 5] ],
//         ],    
//         [
//             [ [1, 2],[1, 5] ],
//             [ [1, 2],[1, 5] ],
//             [ [1, 2],[1, 5] ],
//         ],            
//         ]
//     ],
//     [
//         [
//         [
//             [ [1, 2],[1, 5] ],
//             [ [1, 3],[1, 5] ],
//             [ [1, 2],[1, 5] ],
//         ],    
//         [
//             [ [1, 2],[1, 5] ],
//             [ [1, 2],[1, 5] ],
//             [ [1, 2],[1, 5] ],
//         ],            
//         ]
//     ]]
// )

// console.log(
//     JSON.stringify(matmul(i, i))
// )










// switch (dtype) {
//     case 'float32':
//         this.val = new Float32Array(this.val);
//         break;
//     case 'float64':
//         this.val = new Float64Array(this.val);
//         break;
//     case 'int8':
//         this.val = new Int8Array(this.val);
//         break;
//     case 'int16':
//         this.val = new Int16Array(this.val);
//         break;
//     case 'int32':
//         this.val = new Int32Array(this.val);
//         break;
//     default:
//         this.val = new Float32Array(this.val);
// }