const { genRan, genZero, apply_activation, add, multiply, matmul, transpose } = require("../core/engine/_entry_engine");

const act = require('../core/util/activation');

module.exports = class lstm{
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
        let prev_state = genZero([1, this.neurons])
        let res = [];

        for(let i = 0; i < input.length; i++){            
            const net_otp = []
            for(let n = 0; n < 4; n++){
                const inner1 = matmul(input[i], transpose(this.weight))            
                const inner2 = matmul(prev_output, transpose(this.hiddenWeight))
    
                const op = add( add(inner1, inner2), this.biases )
                
                if(n != 2){
                    net_otp[n] = apply_activation(
                        op, act.sig, act.sigPrime
                    )
                }else{
                    net_otp[n] = apply_activation(
                        op, act.tanh, act.tanhPrime
                    )
                }
            }

            const f = multiply(net_otp[0] , prev_state);
            const r = multiply(net_otp[1] , net_otp[2]);
            prev_state = add(f, r);

            const m = apply_activation(
                prev_state,
                act.tanh,
                act.tanhPrime
            )

            prev_output = multiply(net_otp[3], m);                        
            res.push(prev_output);
        }

        return res;
        if(this.return_seq)
            return res;
        else
            return prev_output;
    }       
}