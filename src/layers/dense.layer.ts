import * as autograd from "../core/engine/_entry_engine";

interface Dense_options{
    prev_neurons:number, 
    neurons:number,
    weights_initialization?:autograd.avb_rand
    biases_initialization?:autograd.avb_rand
}

export class Dense{
    private weights;
    private biases;

    constructor(op:Dense_options){
        this.weights = autograd.rand([op.neurons, op.prev_neurons], op.weights_initialization);
        this.biases = autograd.rand([1, op.neurons], op.biases_initialization);
    }    
    
    feed<arr>(input:autograd.return_type<arr>):autograd.return_type<arr>{
        
        return autograd.applyfn(
                autograd.add(
                    autograd.matmul(input, autograd.transpose(this.weights)),
                    this.biases
            ),
            autograd.act.getAct("sig").fn,
            autograd.act.getAct("sig").delta,
        );

    }    
}

export function dense(op:Dense_options){
    return new Dense(op);
}