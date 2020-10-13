module.exports = class ndarray{
    constructor(val, shape){
        this.val = new Array(val);        
        this.shape = shape ? shape : this.findshape(val);
        this.val = this.extract(val);
        this.rank = this.shape.length;        
    }

    findshape(mat) {
        if(Array.isArray(mat)){
            const shape = [];
            shape.push(mat.length);
            this.findshape(mat[0]).forEach(v => {
                shape.push(v)
            });
            return shape;
        }else{        
            return []
        }
    }

    extract(mat){
        if(Array.isArray(mat)){
            const elements = [];        
            mat.forEach(m => {
                this.extract(m).forEach(v => {
                    elements.push(v)
                });
            })
            return elements;
        }else{        
            return [mat]
        }
    }

    build(shape = this.shape, val = this.val) {        
        const res = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(
                shape.length == 1 
                    ? val[s] 
                    : this.build(
                        shape.slice(1), 
                        val.slice(s * Math.floor(val.length/shape[0]), s * Math.floor(val.length/shape[0]) + shape.slice(1).reduce((a, b) => a*b))
                    )
            );
        }
        return res
    }
}

