const { ops, objs } = require('../core/ndfn/ndfn');
const { backpass, grad_zero, update_loss } = ops;
const dense = require('./dense.layer');

class model{
    constructor(){
        this.layers = [
            new dense(1, 2), 
            new dense(2, 5),
            new dense(5, 5),
            new dense(5, 5),
            new dense(5, 5),
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

    backpropagation(){
        backpass(this.res, new objs.ndarray(this.res.val.map((v, i) => v - (i == 2 ? 1 : 0)), this.res.shape));    
        update_loss(this.res, 0.04);    
        grad_zero(this.res)    
    }
}

const mod = new model();

for(let l = 0; l < 1000; l++){
    mod.feedForword(new objs.ndvertex([1, 1], [1, 1]));
    mod.backpropagation();
}

console.log(
    mod.feedForword(new objs.ndvertex([1], [1, 1])).val
)