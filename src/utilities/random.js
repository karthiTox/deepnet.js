const math = require("../math/entry")
const Matrix = math.Matrix;

module.exports.genRandom = (n) => {
    return gaussianRandom(0, 1) * Math.sqrt(1/n)
}

module.exports.genRandomMatrix = (row, column, n) => {
    let res = Matrix.genEmptyMatrix(row, column);
    for(let r = 0; r < row; r++){
        for(let c = 0; c < column; c++){
            res[r][c] = gaussianRandom(0, 1) * Math.sqrt(1/n);
        }
    }

    return res;
}


function gaussianRandom(mean, sigma) {
    let u = Math.random()*0.682;
    return ((u % 1e-8 > 5e-9 ? 1 : -1) * (Math.sqrt(-Math.log(Math.max(1e-9, u)))-0.618))*1.618 * sigma + mean;
}