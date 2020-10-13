const ndarray = require('./n-array');

module.exports = class ndarray_fn{
    add(a, b){
        return new ndarray(
            a.val.map((a, i) => a + b.val[i]), 
            a.shape,         
        )
    }
    
    sub(a, b){
        return new ndarray(
            a.val.map((a, i) => a - b.val[i]), 
            a.shape,         
        )
    }
    
    
    multiply(a, b){
        return new ndarray(
            a.val.map((a, i) => a * b.val[i]), 
            a.shape, 
        )
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
     * @param {ndarray} a 
     * @param {Array.<number>} dimension
     * 
     * @returns {ndarray}
     */
    transpose(a, dimension = []){
        const  dim = dimension.length != 0 ? dimension : a.shape.map((v, i) => i).reverse()
        const res = this._transpose_main(
            a,
            dim
        )

        const shape = this._cstep_change(a.shape, dim)

        return new ndarray(res, shape)
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
        let b = this.transpose(b_, b_.shape.map((a, i) => i).reverse());
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
     * Returns matmul of two ndarray
     * @param {ndarray} a 
     * @param {ndarray} b 
     * 
     * @returns {ndarray}
     */
    matmul(a, b){
        const res = this._split(a, b)
        const shape = Array.from(a.shape) 
        shape[shape.length - 1] = b.shape[b.shape.length - 1];

        return new ndarray(res, shape)
    }
}