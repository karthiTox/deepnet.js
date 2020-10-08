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

    
    
    genOne(shape = [4]) {
        console.log(shape, val)
        let res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(shape.length <= 1 ? 1 : this.gen(shape.slice(1)));
        }
        return res
    }

    genZero(shape = [4]) {
        console.log(shape, val)
        let res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(shape.length <= 0 ? 1 : this.gen(shape.slice(1)));
        }
        return res
    }

    build(shape = [], val = []) {
        if(!Array.isArray(val)) return val
        const res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(
                shape.length == 1 
                    ? val[s] 
                    : this.build_matrix(
                        shape.slice(1), 
                        val.slice(s * Math.floor(val.length/shape[0]), s * Math.floor(val.length/shape[0]) + shape.slice(1).reduce((a, b) => a*b))
                    )
            );
        }
        return res
    }

    
    transpose(a){
        let res = [];
        const s = a.shape.slice(a.shape.length - 2);
        const r = s[0];
        const c = s[1];

        for (let i = 0; i < r; i++) {
            a.val.slice(i * c, i * c + c).forEach((component, index) => {
                res[index * c + i] = component
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

    add(a, b){
        return a.val.map((a, i) => a + b.val[i])
    }

    sub(a, b){
        return a.val.map((a, i) => a - b.val[i])
    }

    multiply(a, b){
        return a.val.map((a, i) => a * b.val[i])        
    }
}

class tensor extends tensorfn{
    constructor(val, shape, dtype){
            super()            
            this.shape = shape ? shape : this.findshape(val);
            this.dtype = dtype;
            this.val = this.extract(val);
            switch (dtype) {
                case 'float32':
                    this.val = new Float32Array(this.val);
                    break;
                case 'float64':
                    this.val = new Float64Array(this.val);
                    break;
                case 'int8':
                    this.val = new Int8Array(this.val);
                    break;
                case 'int16':
                    this.val = new Int16Array(this.val);
                    break;
                case 'int32':
                    this.val = new Int32Array(this.val);
                    break;
                default:
                    this.val = new Float32Array(this.val);
            }
            this.props = {
                rank : this.shape.length,
            }
    }

    check_val(){
        return this.val.length == this.shape.reduce((a, b) => a * b);
    }


    print(){
        console.log(
            this.build(this.shape, this.val),
        )
    }

}

function test(){
    const a = new tensor(val = [1, 2], null, dtype = 'float32')
    a.print()
    const ten = new tensorfn();
    console.log(ten.sub(a, a))
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