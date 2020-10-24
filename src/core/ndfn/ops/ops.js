const {add, sub, multiply} = require('./basic_ops');
const {expand_to, transpose, matmul} = require('./matrix_ops');
const {traversal, backpass, update_loss, grad_zero} = require('./graph_ops');
const {genRan} = require('./generator');
const {apply_activation} = require('./apply_act');

module.exports = {
    add, sub, multiply, 
    expand_to, transpose, matmul,
    traversal, backpass, update_loss, grad_zero,
    genRan,
    apply_activation 
}