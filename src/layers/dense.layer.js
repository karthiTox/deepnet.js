const { ops } = require('../core/ndfn/ndfn');
const { genRan, apply_activation, add, matmul, transpose } = ops;
const act = require('../core/util/activation');

module.exports = class dense{
    constructor(prev_neurons, neurons){
        this.weight = genRan([neurons, prev_neurons]);
        this.biases = genRan([1, neurons]);
    }    
        
    feed(input){
        return apply_activation(
                add(
                    matmul(input, transpose(this.weight)),
                    this.biases
            ),
            act.sig,
            act.sigPrime,
        )
    }    
}