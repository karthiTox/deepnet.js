const dense = require("./dense.block")
const { genRandomMatrix } = require("../utilities/random")

const { Matrix } = require("../math/entry")
const { activation } = require("../utilities/util")

module.exports = class Seqdense{
    constructor(prev_neurons, neurons){
        this.weights = genRandomMatrix(neurons, prev_neurons);
        this.biases = genRandomMatrix(1, neurons)[0];

        this.output = {
            a: [],
            z: []
        }
    }

    // inputs should be [[1, 2, 3], [1, 2, 3],... ]
    feed(a = []){            
        for(let i = 0; i < a.length; i++){
            let res = Matrix.multiply([a[i]], Matrix.transform(this.weights))[0];
            res = Matrix.pointwiseAddition(this.biases, res);        

            this.output.a[i] = activation.sig(res);
            this.output.z[i] = res;
        }
        
        return this.output.a;         
    }

    // inputs should be [[1, 2, 3], [1, 2, 3],... ]
    back(err, prev_a , prev_z, lr){
        let prev_err = [];

        for(let i = 0; i < err.length; i++){
            let e = Matrix.multiply([err[i]], this.weights)[0];
            prev_err[i] = Matrix.pointwiseMultiply(e, activation.sigPrime(prev_z[i]));        
        }
        
        for(let i = 0; i < err.length; i++){
            this.update(err[i], prev_a[i], lr);
        }
        
        return prev_err
    }

    update(err, prev_a, lr){        
        this.weights.forEach((arr, wi) => {
            this.biases[wi] -= err[wi] * lr;
            arr.forEach((w, ni) => {
                this.weights[wi][ni] -= err[wi] * prev_a[ni] * lr;
            })
        })        
    }
}
