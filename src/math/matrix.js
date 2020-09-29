module.exports = class Matrix{ 
    constructor(){
        this.errorMessage = ">>> Matrix is out of order"
    }
    create(){
        const res = [];
        for(let a = 0; a < arguments.length; a++){
            res.push(arguments[a]);
        }
        return res;
    }  

    add(A = [], B = []){
        try{
            let res = [];
            for(let r = 0; r < A.length; r++){
                res[r] = [];
                for(let c = 0; c < A[r].length; c++){                                                            
                    res[r][c] = A[r][c] + B[r][c];
                }
            }
            return res;
        }catch{
            console.warn(this.errorMessage)
        } 
    }

    sub(A = [], B = []){
        try{
            let res = [];
            for(let r = 0; r < A.length; r++){
                res[r] = [];
                for(let c = 0; c < B[r].length; c++){
                    if(A[r][c] == undefined || B[r][c] == undefined){
                        throw ""
                    }                                                
                    res[r][c] = A[r][c] - B[r][c];
                }
            }
            return res;
        }catch{
            console.warn(this.errorMessage)
        } 
    }

    transform(A=[[1, 2], [1, 2]]){
        let res = this.genEmptyMatrix(A[0].length, A.length)        
        for(let r = 0; r < res.length; r++){
            for(let c = 0; c < res[r].length; c++){                                                              
                res[r][c] = A[c][r];
            }
        }
        return res
    }

    genEmptyMatrix(row, column){
        let res = [];
        for(let r = 0; r < row; r++){
            res[r] = []
            for(let c = 0; c < column; c++){
                res[r][c] = 0
            }
        }
        return res
    }

    genMatrix(row, column, val){
        let res = [];
        for(let r = 0; r < row; r++){
            res[r] = []
            for(let c = 0; c < column; c++){
                res[r][c] = val
            }
        }
        return res
    }

    multiply(A = [], B = []){
        try{
            let res = [];
            for(let r = 0; r < A.length; r++){
                res[r] = [];
                for(let c = 0; c < B[r].length; c++){
                    let sum = 0;
                    for(let k = 0; k < A[r].length; k++){                        
                        sum += A[r][k] * B[k][c];
                    }
                    res[r][c] = sum
                }
            }

            return res;
        }catch{  
            console.warn(this.errorMessage)
        }        
    }

    pointwiseMultiply(a = [], b = []){
        const res = []
        for(let i = 0; i < a.length; i++){
            res[i] = a[i] * b[i];
        }
        return res;
    }

    pointwiseAddition(a=[], b=[]){
        const res = []
        for(let i = 0; i < a.length; i++){
            res[i] = a[i] + b[i];
        }
        return res;
    }

    pointwiseSub(a=[], b=[]){
        const res = []
        for(let i = 0; i < a.length; i++){
            res[i] = a[i] - b[i];
        }
        return res;
    }
}