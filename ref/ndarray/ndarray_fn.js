/**
 * Graph_el contains ndvertex(vertex) and ndedge(edge) which is used to create computational graph for backpass
 * ndvertex and ndedge is also ndarray 
 *      ndvertex : 
 *          stores operands value and address of and edge
 *      ndedge:
 *          stores the derivative of the output ndarray
 */ 

const {ndvertex, ndedge} = require('./ndgraph')
const ndarray = require('./ndarray');

module.exports = class ndarray_fn{
    /**
     * 
     * @param {string} return_type  
     *         if return_type == 'ndarray':
     *              func call in this class will returns ndarray 
     *         if return_type == 'ndvertex':
     *              func call in this class will returns ndvertex, this will be tracked      
     */ 
    constructor({return_type = 'ndarray'}){
        this.return_type = return_type;

        this.create = {
            ndarray: ndarray,
            ndvertex: ndarray,
            ndedge: ndarray,
        }
    }

    /**
     * Returns an addition of two ndarray
     * @param {ndarray} a ndarray or ndvertex
     * @param {ndarray} b ndarray or ndvertex
     * @param {string} return_type specify the custom return type, specifically for this call         
     * 
     * @returns {Array} if return_type == 'ndarray' it will return ndarray
     * @returns {Graph_el.ndvertex} if return_type == 'ndvertex' it will return ndvertex
     */
    add(a, b, return_type = this.return_type){
        const res = a != null ? a.val.map((a, i) => a + b.val[i]) : [];
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
     * @param {string} return_type specify the custom return type, specifically for this call         
     * 
     * @returns {Array} if return_type == 'ndarray' it will return ndarray
     * @returns {Graph_el.ndvertex} if return_type == 'ndvertex' it will return ndvertex
     */
    sub(a, b, return_type = this.return_type){
        const res = a != null ? a.val.map((a, i) => a - b.val[i]) : [];
        const shape = Array.from(a.shape);
        const operation1 = (diff, edge_val) => {
            return diff
        }
        const operation2 = (diff, edge_val) => {
            // prev diff will be changed
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
    
    /**
     * Returns an multiplication of two ndarray 
     * @param {ndarray} a ndarray or ndvertex
     * @param {ndarray} b ndarray or ndvertex
     * @param {string} return_type specify the custom return type, specifically for this call         
     * 
     * @returns {Array} if return_type == 'ndarray' it will return ndarray
     * @returns {Graph_el.ndvertex} if return_type == 'ndvertex' it will return ndvertex
     */
    multiply(a, b, return_type = this.return_type){       
        const res = a != null ? a.val.map((a, i) => a * b.val[i]) : [];
        const shape = Array.from(a.shape);
        const operation = (diff, edge_val) => {
            return this.multiply(diff, edge_val, 'ndarray')
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

    // => results are wrong for square matrix 
    expand_to(a, shape, return_type = this.return_type){
        const res = this._expand_to(a, shape)
        const org_shape = Array.from(a.shape)
        const shape_ = Array.from(shape)
        const operation = (diff) => {
            return this.expand_to(diff, org_shape)
        }
        if(return_type == 'ndarray') 
        return new ndarray(
            res, 
            shape_,
        ) 

        return new ndvertex(
            res,
            shape_,   
            new ndedge(null, null, operation, a)         
        )
    }

    _expand_to(
        a, 
        shape, 
        len = shape.length, 
        step = this._cstep(a.shape), 
        index = []
    ){
        console.log(step)
        const arr = []
        for (let s = 0; s < (shape[0] || 0); s++) {        
            const copy = index.concat([s])
            this._expand_to(a, shape.slice(1), len, step, copy).forEach(el => {
                arr.push(el)
            });
        }
        if(index.length == len){         
            return [a.val[this._cindex(index, step) % (a.val.length)]]
        }
        return arr
    }

    _add_dim(shape, tot_dim){
        if(shape.length == tot_dim){ 
            return shape
        }else if(shape.length < tot_dim){
            const new_shape = Array.from(shape)
            const fill_count = tot_dim - shape.length
            for (let f = 0; f < fill_count; f++) {
                new_shape.unshift(1)                                
            }
            return new_shape
        }
        return shape
    }

    // ----------TRANSPOSE OPERATION----------

    /**
    * Returns step array of the given shap
    * @param {Array.<number>} shape
    * 
    * @returns {Array.<number>} 
    */
    _cstep(shape = []){    
        if(shape.length > 1){
            const current_shape = [shape.slice(1).reduce((a, b) => a * b)]
            return current_shape.concat(this._cstep(shape.slice(1)))
        }else{
            return [1]
        }
    }
    
    /**
     * it swaps the step array with respect to given dimension
     * @param {Array.<number>} step 
     * @param {Array.<number>} dimension 
     * 
     * @returns {Array.<number>}
     */
    _cstep_change(step = [], dimension = []){    
        if(dimension.length > 0){
            const currentstate = [step[dimension[0]]]
            return currentstate.concat(this._cstep_change(step, dimension.slice(1)))
        }else{
            return []
        }
    }
    
    /**
     * Returns dot product of the index and step 
     * @param {Array.<number>} index 
     * @param {Array.<number>} step 
     * 
     * @returns {number}           
     */
    _cindex(index = [], step = []){
        if(index.length > 0){
            const current_index = index[0] * step[0];
            return current_index + this._cindex(index.slice(1), step.slice(1))
        }else{
            return 0
        }
    }
    
    /**
     * Returns the transpose of the given array
     * @param {ndarray} a  
     * @param {Array.<number>} dimension 
     * @param {Array.<number>} shape 
     *      - this will be calculated using _cstep_change function 
     *      - this argument needs to be reversed
     * @param {number} len - length of the shape               
     * @param {Array.<number>} step - this argument needs to be reverse                   
     * @param {Array.<number>} index - this is calculated while recursion
     * 
     * @returns {Array.<number>}
     */
    _transpose_main(
        a, 
        dimension = [], 
        shape = this._cstep_change(a.shape, dimension), 
        len = shape.length,
        step = this._cstep_change(this._cstep(a.shape), dimension), 
        index = []
    ){            
        const arr = []
        for (let s = 0; s < (shape[0] || 0); s++) {        
            const copy = index.concat([s])
            this._transpose_main(a, dimension, shape.slice(1), len, step, copy).forEach(el => {
                arr.push(el)
            });
        }
        if(index.length == len){         
            return [a.val[this._cindex(index, step)]]
        }
        return arr
    }

    /**
     * Returns transpose of the ndarray
     * @param {ndarray} a ndarray or ndvertex
     * @param {Array.<number>} dimension dimension need to be change
     * 
     * @returns {ndarray} if return_type == 'ndarray' it will return ndarray
     * @returns {Graph_el.ndvertex} if return_type == 'ndvertex' it will return ndvertex
     */
    transpose(a, dimension = [], return_type = this.return_type){
        const  dim = dimension 
        ? dimension.length != 0 ? dimension : a.shape.map((v, i) => i).reverse()
        : a.shape.map((v, i) => i).reverse();

        const res = this._transpose_main(
            a,
            dim
        )
        const shape = this._cstep_change(a.shape, dim)

        if(return_type == 'ndarray')
        return new ndarray(
            res, 
            shape
        )

        return new ndvertex(
            res, 
            shape,
            new ndedge(null, null, (diff) => {
                return this.transpose(diff, dim, 'ndarray')
            },
            a)
        )
    }

    //  ----------MATRIX MULTIPLICATION----------  

    /**
     * Retuens matmul of two 2d array
     * @param {ndarray} a 
     * @param {ndarray} b_ 
     * 
     * @returns {Array.<number>}
     */
    _mat_mul_2d(a, b_){  
        let col_step = a.shape[a.shape.length - 1];
        let b = this.transpose(b_, b_.shape.map((a, i) => i).reverse(), 'ndarray');
        let res = []
        for (let r = 0; r < a.val.length / col_step; r++) {
            
            for(let c = 0; c < b_.shape[b_.shape.length - 1]; c++){
                const a_m = a.val.slice(r * col_step, r * col_step + col_step);
                const b_m = b.val.slice(c * col_step, c * col_step + col_step);
    
                res.push(a_m.map((a, i) => a * b_m[i]).reduce((a, b) => a + b))
            }
        }
        return res
    }

    /**
     * this func will split the two ndarray respectively
     * calculate matmul using _mat_mul_2d func
     * @param {ndarray} a 
     * @param {ndarray} b 
     * 
     * @returns {Array.<number>}
     */
    _split(a, b){
        let a_shape = a.shape.slice(a.shape.length - 2);
        let b_shape = b.shape.slice(b.shape.length - 2);
    
        let tot_el_a = a_shape[0] * a_shape[1];
        let tot_el_b = b_shape[0] * b_shape[1];
    
        const res = [];
    
        for (let i = 0; i < a.val.length / tot_el_a; i++) {       
            this._mat_mul_2d(
                new ndarray(a.val.slice(i * tot_el_a, i * tot_el_a + tot_el_a), a_shape),
                new ndarray(b.val.slice(i * tot_el_b, i * tot_el_b + tot_el_b), b_shape)
            ).forEach(v => res.push(v))                                      
        }
    
        return res;
    }

    /**
     * Returns matrix multiplication of two ndarray
     *      
     * @param {ndarray} a ndarray or ndvertex
     * @param {ndarray} b ndarray or ndvertex
     * 
     * @returns {ndarray} if return_type == 'ndarray' it will return ndarray
     * @returns {Graph_el.ndvertex} if return_type == 'ndvertex' it will return ndvertex
     */
    matmul(a, b, return_type = this.return_type){
        const res = this._split(a, b)
        const shape = Array.from(a.shape) 
        shape[shape.length - 1] = b.shape[b.shape.length - 1];

        if(return_type == 'ndarray')
        return new ndarray(res, shape)

        const transb = this.transpose(b, null, 'ndarray')
        const transa = this.transpose(a, null, 'ndarray')
        return new ndvertex(
            res,
            shape,
            new ndedge(
                transb.val,
                transb.shape,
                (diff, edge_val) => {
                    return this.matmul(diff, edge_val, 'ndarray')
                },
                a
            ),
            new ndedge(
                transa.val,
                transa.shape,
                (diff, edge_val) => {
                    return this.matmul(edge_val, diff, 'ndarray')
                },
                b
            )            
        )
    }

    apply_activation(a, act, actPrime, return_type = this.return_type){
        const res = a.val.map(v => act(v));
        const shape = Array.from(a.shape)

        if(return_type == 'ndarray')
        return new ndarray(
            res,
            shape
        )

        return new ndvertex(
            res,
            shape,
            new ndedge(
                a.val.map(v => actPrime(v)),
                shape,
                (diff, edge_val) => {
                    return this.multiply(diff, edge_val, 'ndarray')
                },
                a
            )
        )
    }
    
    genRan(shape, return_type){
        const size = shape.reduce((a, b) => a*b);
        const res = []
        for (let s = 0; s < size; s++) {
            res.push(Math.random());
        }

        if(return_type == "ndarray")
        return new ndarray(res, shape);

        return new ndvertex(res, shape)
    }

    // Graph methods
    /**
     * Travel through every vertex and edge and returns the property you specified
     * @param {Graph_el.ndvertex} z starting vertex
     * @param {string} toPrint prop to print
     * @param {boolean} edge if true edge is included
     * 
     */
    traversal(z, toPrint = 'component', edge = false){
        console.log(z[toPrint]);
        
        z.edges.forEach(e => {
            edge ? console.log(e[toPrint], "<== edge") : edge;
        
            e.pointers.forEach(n => {
                this.traversal(n, toPrint, edge)
            })
        })
    }
     
    /**
     * It will calculate the gradient of all vertex
     * @param {Graph_el.ndvertex} z vertex to start
     * @param {ndarray} diff initial derivative
     */
    backpass(z, diff){        
        z.grad = this.add(z.grad, diff, 'ndarray');
        
        z.edges.forEach(e => {
            e.pointers.forEach(n => {
                this.backpass(n, e.operation(diff, e))
            })
        })
    }

    /**
     * It will update the grad of all vertex
     * @param {Graph_el.ndvertex} z vertex to start
     * @param {number} alpha learning rate
     */
    update_loss(z, alpha = 0.04){        
        z.val = z.val.map((a, i) => a - (z.grad.val[i] * alpha))
    
        z.edges.forEach(e => {
            e.pointers.forEach(n => {
                this.update_loss(n, alpha)
            })
        })
    }

    
    grad_zero(z){        
        z.grad.val = z.grad.val.map(a => 0)
    
        z.edges.forEach(e => {
            e.pointers.forEach(n => {
                this.grad_zero(n)
            })
        })
    }
}