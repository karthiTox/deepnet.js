const { objs, ops } = require('../core/ndfn/ndfn');
const { ndvertex, ndedge } = objs
const { multiply } = ops

module.exports.loss = function(a, y){
    if(Array.isArray(a)){
        
    }else{
        return new ndvertex(
            null,
            null,
            new ndedge(
                a.val.map((v, i) => v - y.val[i]),
                a.shape,
                (diff, edge_val) => {
                    return multiply(diff, edge_val, 'ndarray');
                }
            )
        )
    }
    
}