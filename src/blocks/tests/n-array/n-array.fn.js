const narray = require('./n-array');

module.exports = class narray_fn{
    add(a, b){
        return new narray(
            a.val.map((a, i) => a + b.val[i]), 
            a.shape,         
        )
    }
    
    sub(a, b){
        return new narray(
            a.val.map((a, i) => a - b.val[i]), 
            a.shape,         
        )
    }
    
    
    multiply(a, b){
        return new narray(
            a.val.map((a, i) => a * b.val[i]), 
            a.shape, 
        )
    }

    // Transpose

    genZeroMatrix(row, column){
        let res = [];
        for(let r = 0; r < row; r++){
            res[r] = []
            for(let c = 0; c < column; c++){
                res[r][c] = 0
            }
        }
        return res
    }
    
    transpose_internal_2(A){
        let res = this.genZeroMatrix(A[0].length, A.length)        
        for(let r = 0; r < res.length; r++){
            for(let c = 0; c < res[r].length; c++){                                                              
                res[r][c] = A[c][r];
            }
        }
        return res
    }

    transpose_internal_1(a){
        if(typeof(a[0][0]) == 'number'){
            return this.transpose_internal_2(a);
        }else{       
            const res = [];
            a.forEach((a, i) => {
                res[i] = this.transpose_internal_1(a);
            })
            return res;
        }
    }
    
    transpose(a){
        let res = this.transpose_internal_1(a.build())
        return new narray(res)
    }

    // Matrix multiplication

    matmul_iternal_2(a, b){
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
    
    matmul_internal_1(a, b){
        if(typeof(a[0][0]) == 'number'){
            return this.matmul_iternal_2(a, b);
        }else{       
            const res = [];
            a.forEach((a, i) => {
                res[i] = this.matmul_internal_1(a, b[i]);
            })
            return res;
        }
    }
    
    matmul(a, b){
        let res = this.matmul_internal_1(a.build(), b.build())      
        return new narray(res)            
    }

}