const { Matrix } = require("../math/entry")
const { activation } = require("../utilities/util")
const { genRandomMatrix } = require("../utilities/random")

module.exports = class Dense{
    constructor(prev_neurons, neurons){        
        this.weights = genRandomMatrix(neurons, prev_neurons)
        this.biases = genRandomMatrix(1, neurons)[0]

        this.output = {
            a: [],
            z: []
        }
    }

    feed(inputs = []){                
        let res = Matrix.multiply([inputs], Matrix.transform(this.weights))[0];
        res = Matrix.pointwiseAddition(this.biases, res);        

        this.output.a = activation.sig(res);
        this.output.z = res;
        return this.output.a;    
    }

    back(err, prev_a , prev_z, lr){
        let e = Matrix.multiply([err], this.weights)[0];
        e = Matrix.pointwiseMultiply(e, activation.sigPrime(prev_z));        

        this.update(err, prev_a, lr);

        return e;
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
