// const { ops } = require('../core/ndfn/ndfn');
const { genRan, genZero, apply_activation, add, matmul, transpose } = require("../core/engine/engine_entry");
const act = require('../core/util/activation');

module.exports = class rnn{
    constructor(prev_neurons, neurons, return_seq = true){
        this.prev_neurons = prev_neurons;
        this.neurons = neurons;

        this.weight = genRan([neurons, prev_neurons]);
        this.biases = genRan([1, neurons]);
        
        this.hiddenWeight = genRan([neurons, neurons]);

        this.return_seq = return_seq;
    }    
    
    feed(input = []){
        let prev_output = genZero([1, this.neurons])
        let res = [];

        for(let i = 0; i < input.length; i++){
            const inner1 = matmul(input[i], transpose(this.weight))            
            const inner2 = matmul(prev_output, transpose(this.hiddenWeight))

            const merg = add(
                add(inner1, inner2),
                this.biases
            )

            prev_output =  apply_activation(merg, act.sig, act.sigPrime);
            res.push(prev_output)
        }

        if(this.return_seq)
            return res;
        else
            prev_output;
    }    
}