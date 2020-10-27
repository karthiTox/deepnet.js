module.exports = class ndarray{
    constructor(val, shape){
        this.val = val ? new Array(val) : val;        
        this.shape = val 
                ? shape ? shape : this.findshape(val)
                : val
        this.val = val ? this.extract(this.val) : val;
        this.rank = val? this.shape.length : val;        
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

    print(){
        let res = JSON.stringify(this.build());
        let newstr = ''

        let count = 0;
        for(let cf = 0; cf < res.length; cf++){
            if(res[cf] == '['){
                count++;
            }else{
                break;
            }
        }
        for(let c = 0; c < res.length; c++){            
            if(res[c] == ',' && res[c + 1] == '['){
                let cn_count = 0;
                for(let cn = c+1; cn < res.length; cn++){
                    if(res[cn] != '[') break
                    cn_count += 1;
                }
                newstr += '\n'.repeat(cn_count) + ' '.repeat(count - cn_count);                                      
                continue;
            }            
            newstr += res[c] == ','? ' ' : res[c];
        }          
        console.log(this.constructor.name)
        console.log(' ');
        console.log(newstr)
        console.log(' ');
    }
}

