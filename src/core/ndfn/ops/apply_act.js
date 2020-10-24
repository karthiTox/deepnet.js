const { ndarray, ndvertex, ndedge } = require("../objs/objs");
const {multiply} = require('./basic_ops')

module.exports.apply_activation = function(a, act, actPrime, return_type){
    const res = a.val.map(v => act(v));
    const shape = Array.from(a.shape)

    if(return_type == 'ndarray')
    return new ndarray(
        res,
        shape
    )

    return new ndvertex(
        res,
        shape,
        new ndedge(
            a.val.map(v => actPrime(v)),
            shape,
            (diff, edge_val) => {
                return multiply(diff, edge_val, 'ndarray')
            },
            a
        )
    )
}