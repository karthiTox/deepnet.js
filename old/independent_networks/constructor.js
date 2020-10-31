const util = require("../src/utilities/util")

module.exports.activation = {
    sig : [util.activation.sig, util.activation.sigPrime],
    tanh : [util.activation.tanh, util.activation.tanhPrime],
    reLU : [util.activation.reLU, util.activation.reLUprime],    
    softmax : [util.activation.softmax, util.activation.softmaxPrime],    
}

module.exports.costfn = {
    Quatratic: util.costfn.Quadraticfn,
    CrossEntropy: util.costfn.CrossEntropyfn,
}