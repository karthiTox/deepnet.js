const { ndarray, ndvertex } = require('../../core/ndfn/objs/objs');
const { add } = require('../../core/ndfn/ops/basic_ops');
const { traversal, backpass, update_loss, grad_zero, detach } = require('../../core/ndfn/ops/graph_ops');
const dense = require('../dense.layer')

module.exports = class layerGraph{
    //       i  
    //      / \ 
    //     a   b - i2
    //      \ / 
    //       c
    constructor(){
        this.layerVertex = class vertex{
            constructor(layer, parents, merge, name){
                this.layer = layer;
                this.parents = parents;            
                this.output = null       
                this.name = name 
                
                this.init(merge)
            }
            
            init(merge){
                this.merge = merge ? merge : (res = []) => {
                    if(res.length == 1){
                        return res[0]
                    }else{
                        return res.reduce((a, b) => add(a, b))
                    }
                }
            }
        
            feed(ip){      
                const input = this.merge(ip);          
                if(!this.output){
                    this.output = this.layer.feed(input);            
                    return this.output;        
                }
                return this.output;
            }
        }
        
        this.res = null;
    }

    

    _feed_internal(z){
        if(z.parents){            
            // collecting outputs of parents
            const res = [];            
            z.parents.forEach(p => { 
                res.push(this._feed_internal(p));
            });            

            // feed in current layer
            return z.feed(res)
        }
        else
            return z.feed([new ndvertex([1], [1, 1])]);
    }

    feedForword(z){
        this.res = this._feed_internal(z)
        return this.res
    }

    backpropagation(output){
        let res = this.res
        backpass(res, new ndarray(res.val.map((v, i) => v - output[i]), res.shape));    
        update_loss(res, 0.04);    
        grad_zero(res)
        detach(res)
        res = null;
    }
}

// function tra(z){
//     if(z.parents){            
//         // collecting outputs of parents
//         const res = []
//         z.parents.forEach(p => {
//             res.push(tra(p))
//         });

//         // feed in current layer
//         return z.call(res)
//     }
//     else
//         return z.call([new ndvertex([1], [1, 1])]);
// }