const { Transform, Readable, Writable } = require("stream");
const { createReadStream } = require("fs");
const { join } = require("path");

const stream_options = {
    id:0,
    name:"",
}

class _element_wise extends Transform{
    constructor(type = "add" || "multiply" || "sub", id = 0){
        super({objectMode:true});
        this.waitings = {}; // [id, index, value]
        this.id = id;
        this.type = type
    }

    _transform(c, e, n){
        if(c[1] in this.waitings){
            this.push(
                [
                    this.id, 
                    c[1], 
                    this.type == "add" 
                    ? this.waitings[c[1]] + c[2] 
                    : this.type == "multiply"
                        ? this.waitings[c[1]] * c[2]
                        : this.waitings[c[1]] - c[2] 
                ]);
            delete this.waitings[c[1]];
        }else{
            this.waitings[c[1]] = c[2];
        }
        n();        
    }
}

class _transpose extends Transform{
    constructor(id = 0, input_shape = [], input_step = [], _step = []){
        super({objectMode:true});
        this.id = id;  
        
        this.shape = input_shape;
        this.step = input_step;
        this._step = _step;
    }

    _transform(c, e, n){
        let res = 0; 
        for(let sh = 0; sh < this.shape.length; sh++){
            let inter = this.shape[sh] * this.step[sh];
            let inter2 = Math.floor( (c[1] % inter) / this.step[sh] );
            res += inter2 * this._step[sh]
        }
        this.push([this.id, res, c[2]])
        n();
    }
}

class mapper extends Transform{
    constructor({
        id = 0, 
        i = 0, 
        j = 0, 
        k = 0, 
        inputs = {
            0:{
                input_shape : [], 
                input_step : [], 
            },
            1:{
                input_shape : [], 
                input_step : [], 
            }
        },
        op_shape = [], 
        op_step = []
    }){
        super({objectMode:true});
        this.id = id;

        this.i = i,
        this.k = k;
        
        this.inputs = inputs
        
        this.op_shape = op_shape;
        this.op_step = op_step;
    }
    // ip [id, index, value] 
    // op [chunk_id, op_index, j, value]
    _transform(c, e, n){
        let index = []; 
        const _shape = this.inputs[c[0]].input_shape;
        const _step = this.inputs[c[0]].input_step;
        for(let sh = 0; sh < _shape.length; sh++){
            let inter = _shape[sh] * _step[sh];
            let inter2 = Math.floor( (c[1] % inter) / _step[sh] );
            index[sh] = inter2 
        }

        if(c[0] == 0){
            let i = index[0];
            let j = index[1];
            
            for(let k = 0; k < this.k; k++){
                this.push(
                    [
                        c[0],
                        [i, k].map((v, i) => v * this.op_step[i]).reduce((a, b) => a+b),                         
                        c[2],
                        j
                    ]
                )            
            }
        }

        else if(c[0] == 1){
            let j = index[0];
            let k = index[1];

            for(let i = 0; i < this.i; i++){
                this.push(
                    [
                        c[0],
                        [i, k].map((v, i) => v * this.op_step[i]).reduce((a, b) => a+b),                        
                        c[2],
                        j
                    ]
                )            
            }
        }

        n();
    }
}

class reducer extends Transform{
    constructor({id = 0, i = 0, j = 0, k = 0}){
        super({objectMode:true});
        this.id = id;

        this.i = i;
        this.j = j;
        this.k = k;
        
        this.waitings = {
            // 0:[1] // Matid, val
        }
    }

    _transform(c, e, n){        
        if( c[1] in this.waitings ){
            this.waitings[c[1]].push(c)
        }else{
            this.waitings[c[1]] = [c]
        }

        if( c[1] in this.waitings ){            
            if(this.waitings[c[1]].length == this.j*2){ 

                let total = 0;
                for(let j = 0; j < this.j; j++){

                    let find = this.waitings[[c[1]]][0];                                                
                    for (let w = 1; w < this.waitings[c[1]].length; w++) {   
                        
                        let li = find[find.length - 1];

                        if(this.waitings[c[1]][w][find.length - 1] == li){
                            const found = this.waitings[c[1]][w]
                            
                            total += find[find.length - 2] * found[found.length - 2]                            
                            delete this.waitings[c[1]][0];
                            delete this.waitings[c[1]][w];

                            this.waitings[c[1]] = this.waitings[c[1]].filter(function(el){
                                return el != null
                            });
                        }
                                                                  
                    }                    
                }

                this.push([this.id, c[1], total])
            }
        }

        n()
    }
}


const a = new Readable({objectMode:true, read(){}});
const w = new Writable({objectMode:true})
w._write = (c, e, n) => {
    console.log(c);
    n()
}
a.pipe(new mapper({
    id:2, 
    i:3, 
    j:3, 
    k:3, 
    inputs:{
        0:{
            input_shape:[3, 3], 
            input_step:[3, 1],         
        },
        1:{
            input_shape:[3, 3],
            input_step:[3, 1], 
        }
    },
    op_shape:[3, 3],
    op_step:[3, 1],
})).pipe(new reducer({
    id:2, 
    i:3, 
    j:3, 
    k:3
})).pipe(w);

a.push([1, 8, 5])
a.push([0, 0, 1])
a.push([0, 1, 2])
a.push([1, 4, 4])
a.push([0, 6, 7])
a.push([0, 3, 4])
a.push([1, 7, 2])
a.push([1, 3, 2])
a.push([0, 7, 8])
a.push([0, 8, 9])


a.push([1, 0, 1])
a.push([1, 5, 6])
a.push([1, 2, 1])
a.push([1, 1, 2])
a.push([0, 4, 5])
a.push([1, 6, 7])
a.push([0, 2, 3])
a.push([0, 5, 6])
