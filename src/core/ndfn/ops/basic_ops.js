const { ndarray, ndvertex, ndedge } = require("../objs/objs");

/**
 * Returns an addition of two ndarray
 * @param {ndarray} a ndarray or ndvertex
 * @param {ndarray} b ndarray or ndvertex
 * @param {string} return_type specify the return type, specifically for this call         
 * 
 * @returns {ndarray} if return_type == 'ndarray' it will return ndarray
 * @returns {ndvertex} if return_type == 'ndvertex' it will return ndvertex
 */
module.exports.add = function(a, b, return_type){
    const res = a.val.map((a, i) => a + b.val[i]);;
    const shape = Array.from(a.shape);
    const operation = (diff, edge_val) => {
        return diff
    }

    if(return_type == 'ndarray') 
    return new ndarray(
        res, 
        shape,
    ) 

    
    return new ndvertex(
        res, 
        shape,
        new ndedge(null, null, operation, a),
        new ndedge(null, null, operation, b),
    )
}

/**
 * Returns an differance of two ndarray
 * @param {ndarray} a ndarray or ndvertex
 * @param {ndarray} b ndarray or ndvertex
 * @param {string} return_type specify the return type, specifically for this call         
 * 
 * @returns {ndarray} if return_type == 'ndarray' it will return ndarray
 * @returns {ndvertex} if return_type == 'ndvertex' it will return ndvertex
 */
module.exports.sub = function(a, b, return_type){
    const res = a.val.map((a, i) => a - b.val[i]);
    const shape = Array.from(a.shape);
    const operation1 = (diff, edge_val) => {
        return diff
    }
    const operation2 = (diff, edge_val) => {
        // incomming diff will be changed because of diff.val
        diff.val = diff.val.map(v => v * -1) 
        return diff
    }

    if(return_type == 'ndarray') 
    return new ndarray(
        res, 
        shape,
    ) 

     
    return new ndvertex(
        res, 
        shape,
        new ndedge(null, null, operation1, a),
        new ndedge(null, null, operation2, b),
    )
}

module.exports.multiply = _multiply;
/**
 * Returns an multiplication of two ndarray 
 * @param {ndarray} a ndarray or ndvertex
 * @param {ndarray} b ndarray or ndvertex
 * @param {string} return_type specify the return type, specifically for this call         
 * 
 * @returns {ndarray} if return_type == 'ndarray' it will return ndarray
 * @returns {ndvertex} if return_type == 'ndvertex' it will return ndvertex
 */
function _multiply(a, b, return_type){       
    const res = a.val.map((a, i) => a * b.val[i]);
    const shape = Array.from(a.shape);
    const operation = (diff, edge_val) => {
        return _multiply(diff, edge_val, 'ndarray')
    }

    if(return_type == 'ndarray') 
    return new ndarray(
        res, 
        shape,
    ) 

    
    return new ndvertex(
        res, 
        shape,
        new ndedge(b.val, b.shape, operation, a),
        new ndedge(a.val, a.shape, operation, b),
    )
}
