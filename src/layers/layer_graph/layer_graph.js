const { ndarray } = require("../../core/ndfn/objs/objs");
const { backpass, update_loss, grad_zero, detach } = require('../../core/ndfn/ops/graph_ops');
const vertex = require("./layer_vertex");

module.exports = class LayerGraph{
    constructor(){
        this.add = (layer, parents, merge, name) => {
            return new vertex(layer, parents, merge, name);
        }
        
    }
    feedForword(z, input){
        this.res = this._feedForword(z, input);
        return this.res;
    }
    
    _feedForword(z, input){        
        if(z.parents){            
            // collecting outputs of parents
            const res = [];            
            z.parents.forEach((p) => { 
                if(!p.output)                
                    res.push(this._feedForword(p, input));
                else
                    res.push(p.output)
            });            
    
            // feed in current layer
            return z.feed(res)
        }
        else
            return z.feed([ input[z.name] ]);
    }
    
    
    reset(z){        
        z.output = null;        
        if(z.parents){                                  
            z.parents.forEach((p) => { 
                this.reset(p)            
            });                    
        }
        else
            return;
    }
    
    backpropagation(output){    
        if(!Array.isArray(this.res)){
            backpass(this.res, new ndarray(this.res.val.map((v, i) => v - output[i]), this.res.shape));    
            update_loss(this.res, 0.04);    
            grad_zero(this.res)
            detach(this.res)  
        }
        
        else{
            for(let r = this.res.length-1; r >= 0; r--){            
                const local_res = this.res[r];                
                backpass(local_res, new ndarray(local_res.val.map((v, i) => v - output[r][i]), local_res.shape));    
                update_loss(local_res, 0.04);    
                grad_zero(local_res)            
            }
            
            for(let r = this.res.length-1; r >= 0; r--){            
                const local_res = this.res[r];                            
                detach(local_res)            
            }          
        }
    }
}



