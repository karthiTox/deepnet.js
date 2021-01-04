// const { ops, objs } = require('../core/ndfn/ndfn');
const { backpass, grad_zero, update_loss, detach, traversal } = require('../core/engine/graph');
const { tensor } = require('../core/engine/tensor');
const { vertex } = require('../core/engine/vertex');
const dense = require('./dense.layer');

const seqdense = require('./seqdense.layer');
const rnn = require('./rnn.layer');
const lstm = require('./lstm.layer');
const { genZero } = require('../core/engine/engine_entry');
const { add, multiply, matmul, transpose, sub } = require('../core/engine/engine_entry');
const { kernel } = require('../core/engine/gpu/kernel');
// const { loss } = require('./loss.fn');
// const { detach } = require('../core/ndfn/ops/graph_ops');
console.time("t")
class model{
    constructor(){
        this.layers = [
            new dense(10, 1),            
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
        const res = this.res; 
        res.grad_ = new tensor(res.tensor_.data.map((v, i) => v - 1), res.tensor_.shape);                        
        backpass(res);                        
        update_loss(res, 1);    
        grad_zero(res);

        // for(let r = this.res.length-1; r >= 0; r--){            
        //     const res = this.res[r]; 
        //     res.grad_ = new tensor(res.tensor_.data.map((v, i) => v - output[i]), res.tensor_.shape);                        
        //     backpass(res);                        
        // }
        
        // for(let r = this.res.length-1; r >= 0; r--){            
        //     const res = this.res[r];                            
        //     update_loss(res, 1);    
        //     grad_zero(res);
        //     // detach(res);
        // }
        // console.log(this.res)
    }
}

const mod = new model();
const a = new Array(10).fill(1)
for (let index = 0; index < 100000; index++){
    const res = mod.feedForword(new vertex(new tensor(a, [1, 10])));    
    mod.backpropagation(1);
}

console.log(Math.round((process.memoryUsage().heapUsed / 1024 / 1024)*100)/100, "MB")
