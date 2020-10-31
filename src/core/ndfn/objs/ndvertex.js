const ndarray = require("./ndarray");

module.exports = class ndvertex extends ndarray{
    constructor(val, shape, edges){
        super(val, shape);

        this.grad = new ndarray(this.val.map(v => 0), Array.from(this.shape))
        this.edges = [];
        for (let i = 2; i < arguments.length; i++) {
            this.edges.push(arguments[i]); // edge
        }
    }
}
