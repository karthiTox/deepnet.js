const ndarray = require("./ndarray");

module.exports.ndvertex = class ndvertex extends ndarray{
    constructor(val = [], shape = [], edges){
        super(val, shape);

        this.grad = new ndarray(this.val.map(v => 0), this.shape)
        this.edges = [];
        for (let i = 2; i < arguments.length; i++) {
            this.edges.push(arguments[i]); // edge
        }
    }
}

module.exports.ndedge = class ndedge extends ndarray{
    constructor(val, shape, operation, vertex){
        super(val, shape);

        this.operation = operation;
        this.pointers = [];
        for (let i = 3; i < arguments.length; i++) {
            this.pointers.push(arguments[i]); // node
        }
    }
}