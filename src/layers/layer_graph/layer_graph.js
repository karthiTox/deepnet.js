const { ndarray, ndvertex } = require('../../core/ndfn/objs/objs');
const { backpass, update_loss, grad_zero, detach } = require('../../core/ndfn/ops/graph_ops');
const layer_vertex = require('./layer_vertex')

module.exports = class layerGraph{
    //       i  
    //      / \ 
    //     a   b - i2
    //      \ / 
    //       c
    constructor(){
        this.res = [];
        
        this.prev_added = null;
        this.entry = [];
        this.exit = [];

        this.count = 0;
        this.in_count = 0;

        this.inputs = []
    }

    add({layer, parents = [], name = 'default', merge = null}){
        let par = null;
        if(parents){
            if(parents.length == 0 ){
                if(this.prev_added) 
                    par = [this.prev_added];                
            }
            else if (parents.length > 0) par = parents        
        }               
        const v = new layer_vertex(layer, par, merge, name, this.count, !par?this.in_count:null)
        
        this.exit.forEach((ev, i) => {
            if(v.parents){
                v.parents.forEach(ver => {
                    if(ver.index == ev.index){
                        this.exit = this.exit.slice(0, i-1).concat(this.exit.slice(i+1)); 
                        return;
                    }                    
                })
            }
        })

        if(!v.parents){
            this.entry.push(v);
            this.in_count += 1;
        }
        this.exit.push(v);
        this.prev_added = v;
        this.count += 1;

        return v
    }

    _feed_internal(z){
        if(z.parents){            
            // collecting outputs of parents
            const res = [];            
            z.parents.forEach((p) => { 
                if(!p.output)                
                    res.push(this._feed_internal(p));
                else
                    res.push(p.output)
            });            

            // feed in current layer
            return z.feed(res)
        }
        else
            return z.feed([this.inputs[z.input_index]]);
    }

    feedForword(){
        this.inputs = [...arguments];
        this.res = [];
        this.exit.forEach(ex => {
            this.res.push(this._feed_internal(ex))
        })
        return this.res
    }

    backpropagation(){
        const output = [...arguments];                
        this.res.forEach((res, ri) => { // multiply results
            if(Array.isArray(res)){
                // Seq output
                for(let vi = res.length - 1; vi >= 0; vi--){
                    const ndv = res[vi];
                    backpass(ndv, new ndarray(ndv.val.map((v, i) => v - output[ri][vi].val[i]), ndv.shape));    
                    update_loss(ndv, 0.04);    
                    grad_zero(ndv)        
                }
                return;
            }
            // non-seq output
            backpass(res, new ndarray(res.val.map((v, i) => v - output[ri].val[i]), res.shape));    
            update_loss(res, 0.04);    
            grad_zero(res)
        })
        this.res.forEach(res => {
            if(Array.isArray(res)){
                res.forEach((ndv) => {
                    detach(ndv)
                })
                return;
            }
            detach(res)
        })            
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