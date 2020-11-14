// const { ops, objs } = require('../core/ndfn/ndfn');
const { backpass, grad_zero, update_loss, detach, traversal } = require('../core/engine/graph');
const { tensor } = require('../core/engine/tensor');
const { vertex } = require('../core/engine/vertex');
const dense = require('./dense.layer');

const seqdense = require('./seqdense.layer');
const rnn = require('./rnn.layer');
const lstm = require('./lstm.layer');
const { genZero } = require('../core/engine/_entry_engine');
const { add, multiply, matmul, transpose, sub } = require('../core/engine/_entry_engine');
// const { loss } = require('./loss.fn');
// const { detach } = require('../core/ndfn/ops/graph_ops');

class model{
    constructor(){
        this.layers = [
            new lstm(1, 3),            
            new seqdense(3, 2)
        ];      
    }

    feedForword(input){     
        let res = input;

        for(let l = 0; l < this.layers.length; l++){
            res = this.layers[l].feed(res);
        }
        
        this.res = res;
        return res;
    }

    backpropagation(output){ 
        for(let r = this.res.length-1; r >= 0; r--){            
            const res = this.res[r]; 
            res.grad_ = new tensor(res.tensor_.data.map((v, i) => v - output[i]), res.tensor_.shape);                        
            backpass(res);                        
        }
        
        for(let r = this.res.length-1; r >= 0; r--){            
            const res = this.res[r];                            
            update_loss(res, 1);    
            grad_zero(res);
            // detach(res);
        }
        // console.log(this.res)
    }
}

const mod = new model();

for(let i = 0; i < 100; i++){
    mod.feedForword( 
        [
            new vertex(new tensor([1], [1, 1])),            
            new vertex(new tensor([0], [1, 1])),            
        ]
    );

    mod.backpropagation([1, 1]);    

    // mod.feedForword( 
    //     [
    //         new vertex(new tensor([0], [1, 1])),
    //         new vertex(new tensor([0], [1, 1]))
    //     ]
    // );

    // mod.backpropagation([[0, 0], [0, 0]]);
}

const res = mod.feedForword( 
    [
        new vertex(new tensor([1], [1, 1])),        
        new vertex(new tensor([0], [1, 1])),        
    ]
);

console.log("-----------res")
res.forEach(t => t.tensor_.print())


// mod.feedForword( 
//     [
//         new vertex(new tensor([0], [1, 1])),
//         new vertex(new tensor([0], [1, 1]))
//     ]
// ).forEach(t => t.tensor_.print());

