const standardnet = require("./src/nn");
const rnn = require("./src/rnn");
const constructor = require("./src/constructor");

module.exports = {
    constructor: constructor,
    StandardNet: standardnet,
    recurrent:{
        rnn: rnn
    },
}