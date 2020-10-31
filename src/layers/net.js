const { ops, objs } = require('../core/ndfn/ndfn');
const { backpass, grad_zero, update_loss } = ops;
const dense = require('./dense.layer');
const seqdense = require('./seqdense.layer');
const rnn = require('./rnn.layer');
const lstm = require('./lstm.layer');
const { loss } = require('./loss.fn');
const { detach } = require('../core/ndfn/ops/graph_ops');

class model{
    constructor(){
        this.layers = [
            new lstm(1, 3),
            new lstm(3, 1),
            // new seqdense(3, 1)
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
                backpass(res, new objs.ndarray(res.val.map((v, i) => v - output[r]), res.shape));    
                update_loss(res, 0.04);    
                grad_zero(res)            
            }
            
        for(let r = this.res.length-1; r >= 0; r--){            
            const res = this.res[r];                            
            detach(res)            
        }
        // console.log(this.res)
    }
}

const mod = new model();

for(let l = 0; l < 1000; l++){
    mod.feedForword( 
        [
            new objs.ndvertex([1], [1, 1]),             
            new objs.ndvertex([0], [1, 1]),
        ] 
    );
    mod.backpropagation([0, 1]);

    mod.feedForword( 
        [
            new objs.ndvertex([0], [1, 1]), 
            new objs.ndvertex([0], [1, 1]),                        
        ] 
    );
    mod.backpropagation([0, 0]);
}

console.log(
    mod.feedForword( 
        [
            new objs.ndvertex([1], [1, 1]), 
            new objs.ndvertex([0], [1, 1]),            
        ] 
    ),

    mod.feedForword( 
        [
            new objs.ndvertex([0], [1, 1]), 
            new objs.ndvertex([0], [1, 1]),                        
        ] 
    ),
)