const standardnet = require("./src/nn");
const constructor = require("./src/constructor");

module.exports = {
    VanillaNet: standardnet,
    StandardNet: standardnet,
    constructor: constructor,
}