const { Matrix } = require('../../math/entry');
const dense = require('../dense.block');
const Seqdense = require('../Seqdense.block');
const Recurrent = require('../recurrent.block');
const { calculateErr } = require("../loss.block");

class model{
    constructor(){
        this.layers = [0, new Recurrent(1, 10), new Seqdense(10, 1)]
        this.output = []
    }

    feedForword(input = []){ 
        this.layers[0] = {
            output: {
                a : input,
                z : input,
            }
        }
        
        let res = input    
        
        for(let l = 1; l < this.layers.length; l++){
            res = this.layers[l].feed(res);
        }

        this.output = res
        return res
    }

    backpropagation(target = []){
        let err = calculateErr(this.output, target);

        for(let l = this.layers.length - 1; l > 0; l--){
            // err, prev_a , prev_z, lr
            err = this.layers[l].back(err, this.layers[l - 1].output.a, this.layers[l - 1].output.z, 0.06);
        }        
    }
}

const mod = new model();

for(let l = 0; l < 200; l++){
    mod.feedForword([[0], [0], [0], [0], [1]]);
    mod.backpropagation([[0], [0], [0], [0], [1]]);
}

console.log(
    mod.feedForword([[0], [0], [0], [0], [1]])
)