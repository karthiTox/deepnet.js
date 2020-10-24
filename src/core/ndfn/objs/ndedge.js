const ndarray = require("./ndarray");

module.exports = class ndedge extends ndarray{
    constructor(val, shape, operation, vertex){
        super(val, shape);

        this.operation = operation;
        this.pointers = [];
        for (let i = 3; i < arguments.length; i++) {
            this.pointers.push(arguments[i]); // vertex
        }
    }
}