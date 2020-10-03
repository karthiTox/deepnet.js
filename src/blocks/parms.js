const { genRandomMatrix } = require("../utilities/random")

module.exports = class Parms{
    constructor(PrevNurons, NumNurons){
        this.weights = genRandomMatrix(NumNurons, PrevNurons)
        this.biases = genRandomMatrix(1, NumNurons)[0]
    }
}