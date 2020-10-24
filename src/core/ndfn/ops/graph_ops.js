const { ndarray, ndvertex, ndedge } = require("../objs/objs");
const {add} = require('./basic_ops')

module.exports = {
    traversal: traversal,
    backpass: backpass,
    update_loss: update_loss,
    grad_zero: grad_zero
}

// Graph methods
/**
 * Travel through every vertex and edge and returns the property you specified
 * @param {Graph_el.ndvertex} z starting vertex
 * @param {string} toPrint prop to print
 * @param {boolean} edge if true edge is included
 * 
 */
function traversal(z, toPrint = 'component', edge = false){
    console.log(z[toPrint]);
    
    z.edges.forEach(e => {
        edge ? console.log(e[toPrint], "<== edge") : edge;
    
        e.pointers.forEach(n => {
            traversal(n, toPrint, edge)
        })
    })
}
 
/**
 * It will calculate the gradient of all vertex
 * @param {Graph_el.ndvertex} z vertex to start
 * @param {ndarray} diff initial derivative
 */
function backpass(z, diff){        
    z.grad = add(z.grad, diff, 'ndarray');
    
    z.edges.forEach(e => {
        e.pointers.forEach(n => {
            backpass(n, e.operation(diff, e))
        })
    })
}

/**
 * It will update the grad of all vertex
 * @param {Graph_el.ndvertex} z vertex to start
 * @param {number} alpha learning rate
 */
function update_loss(z, alpha = 0.04){        
    z.val = z.val.map((a, i) => a - (z.grad.val[i] * alpha))

    z.edges.forEach(e => {
        e.pointers.forEach(n => {
            update_loss(n, alpha)
        })
    })
}


function grad_zero(z){        
    z.grad.val = z.grad.val.map(a => 0)

    z.edges.forEach(e => {
        e.pointers.forEach(n => {
            grad_zero(n)
        })
    })
}