const {add, sub, multiply} = require('./basic_ops');
const {expand_to, transpose, matmul, concat} = require('./matrix_ops');
const {traversal, backpass, update_loss, grad_zero, detach} = require('./graph_ops');
const {genRan, genZero} = require('./generator');
const {apply_activation} = require('./apply_act');

module.exports = {
    add, sub, multiply, 
    expand_to, transpose, matmul, concat,
    traversal, backpass, update_loss, grad_zero, detach,
    genRan, genZero,
    apply_activation 
}