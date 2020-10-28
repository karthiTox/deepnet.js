const { add, sub, multiply } = require("../core/ndfn/ops/basic_ops")
const { concat } = require("../core/ndfn/ops/matrix_ops")

module.exports = {
    add:(res) => {
        return merge(res, add)
    },

    sub:(res) => {
        return merge(res, sub)
    },

    multiply:(res) => {
        return merge(res, multiply)
    },

    concat:(res) => {
        return merge(res, concat)
    },
}

function merge(res, method){
    if(!Array.isArray(res[0])){                
        return res.reduce((a, b) => method(a, b)) 
    }else{                
        // [[ndarray{}], [ndarray{}]] 
        return res.reduce((a, b) => a.map((v, i) => method(v, b[i])))
    }
}
