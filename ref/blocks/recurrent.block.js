const { Matrix } = require("../math/entry")
const { activation } = require("../utilities/util")
const { genRandomMatrix } = require("../utilities/random")
const costfn = require("../utilities/costfn")


module.exports = class Recurrent{
    constructor(prev_neurons, neurons, output_sequence = true){ 
        this.output_sequence = output_sequence

        this.weights = genRandomMatrix(neurons, prev_neurons)
        this.biases = genRandomMatrix(1, neurons)[0]                
        this.hiddenWeights = genRandomMatrix(neurons, neurons);

        this.output = {
            a: [],
            z: []
        }
    }

    //  many to many or many to one
    feed(a = [], output_sequence = this.output_sequence){  
        this.output.a = [];
               
        for(let i = 0; i < a.length; i++){
            let res = Matrix.multiply([a[i]], Matrix.transform(this.weights))[0];
            let ha = i == 0 ? new Array(this.weights.length).fill(0) : this.output.a[i - 1]
            let hres = Matrix.multiply([ha], Matrix.transform(this.hiddenWeights))[0];        
            res = Matrix.pointwiseAddition(hres, res);     
            res = Matrix.pointwiseAddition(this.biases, res);     
            
            this.output.a[i] = activation.sig(res);
            this.output.z[i] = res;
        }

        return this.output.a
    }

    back(err, prev_a , prev_z, lr){        
        let er = err.map(arr => arr.map(v => 0));        
        let res_err = [];        

        for(let i = err.length - 1; i >= 0; i--){
            let err_ = Matrix.pointwiseAddition(err[i], er[i]) 

            let err_n = Matrix.multiply([err_], this.weights)[0];               
            err_n = Matrix.pointwiseMultiply(err_n, activation.sigPrime(prev_z[i]));
            
            let err_h = Matrix.multiply([err[i]], this.hiddenWeights)[0];                           
            err_h = Matrix.pointwiseMultiply(err_h, activation.sigPrime(i == 0 ? er[i] : this.output.z[i - 1]))
            
            if(i != 0) er[i - 1] = err_h;            
            res_err[i] = err_n 
            this.update(err[i], prev_a[i], lr)
            this.updateh(err[i], i == 0 ? this.output.a[i].map(v => 0) : this.output.a[i - 0], lr)
        }            
        
        return res_err
    }

    update(err, prev_a, lr){        
        this.weights.forEach((arr, wi) => {
            this.biases[wi] -= err[wi] * lr;
            arr.forEach((w, ni) => {
                this.weights[wi][ni] -= err[wi] * prev_a[ni] * lr;
            })
        })   
    }

    updateh(err, prev_h, lr){        
        this.hiddenWeights.forEach((arr, wi) => {            
            arr.forEach((w, ni) => {
                this.hiddenWeights[wi][ni] -= err[wi] * prev_h[ni] * lr;
            })
        })   
    }

    

}
