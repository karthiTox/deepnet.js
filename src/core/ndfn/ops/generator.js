const { ndarray, ndvertex, ndedge } = require("../objs/objs");

module.exports.genRan = function(shape, return_type){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(Math.random());
    }

    if(return_type == "ndarray")
    return new ndarray(res, shape);

    return new ndvertex(res, shape)
}