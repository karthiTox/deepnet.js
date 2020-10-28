const { isCallSignatureDeclaration } = require("typescript");
const { add } = require("../../core/ndfn/ops/basic_ops");

module.exports = class vertex{
    constructor(_layer, _parents, _merge, _name, index, input_index){
        this.layer = _layer;
        this.parents = _parents;       
        this.name = _name, 
        this.index = index,
        this.input_index = input_index
        this.output = null       
        this.init(_merge)
    }
    
    init(merge){
        this.merge = merge ? merge : (res = []) => {            
            if(!Array.isArray(res[0])){                
                return res.reduce((a, b) => add(a, b)) 
            }else{                
                // [[ndarray{}], [ndarray{}]] 
                return res.reduce((a, b) => a.map((v, i) => add(v, b[i])))
            }
        }                                
    }

    feed(ip){                   
        const input = this.merge(ip);                  
        this.output = this.layer.feed(input);            
        return this.output;                        
    }
}