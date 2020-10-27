const { add } = require("../core/ndfn/ops/basic_ops")

module.exports = class merge{
    feed(res = []){
        // it will add all the inputs
        // if(!Array.isArray(res[0])){
            if(res.length == 1){
                return res[0]
            }else{
                return res.reduce((a, b) => add(a, b))
            }        
        // }else{
        //     if(res.length == 1){
        //         return res[0]
        //     }else{
        //         // [[ndarray{}], [ndarray{}]] 
        //         return res.reduce((a, b) => a.map((v, i) => add(v, b[i])))
        //     }
        // }
    }
}