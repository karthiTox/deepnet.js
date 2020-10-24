const { Matrix } = require("../math/entry")

module.exports.calculateErr = (a, y) => {
    if(Array.isArray(a[0])){
        return a.map((a, i) => Matrix.pointwiseSub(a, y[i]))
    }
    return Matrix.pointwiseSub(a, y)
}