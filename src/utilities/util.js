const activation = require("./activation");
const random = require("./random");

module.exports.ranWeight = (n=1) => {
    return random.genRandom(n)
}

module.exports.ranBiases = (n=1) => {
    return random.genRandom(n)
}

module.exports.costfn = require("./costfn");

module.exports.activation = new activation()