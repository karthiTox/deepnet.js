import { IKernelFunctionThis } from "gpu.js";
import { tensor } from "../tensor";
import { kernels } from "./kernel";

function _cstep(shape:number[]):number[]{   
    const res = [];
    for(let s = shape.length; s > 0; s--){
        if(!shape[s]) 
            res.unshift(1);
        else
            res.unshift(
                shape.slice(s).reduce((a, b) => a * b)
            );        
    }
    return res;    
}

function _cstep_change(step:number[], dimension:number[]):number[]{    
    const res = [];
    for(let d = 0; d < dimension.length; d++){
        res[d] = step[dimension[d]]
    }
    return res;
}

function _cindex(index:number[], step:number[]):number{
    let res = 0; 
    for(let i = 0; i < index.length; i++){        
        res += index[i] * step[i];
    }
    return res;
}

function _findIndex(shape:number[], step:number[], index:number):number[]{    
    const _s = [];
    for(let s = 0; s < shape.length; s++){
        _s[s] = shape[s] * step[s]; 
        _s[s] = Math.floor((index%_s[s]) / step[s]);
    }
    
    return _s;
}

function _transpose_main(
    a:number[], 
    shape:number[], 
    step:number[], 
    dimension:number[],         
){         
    const _step = _cstep_change(step, dimension);
    
    const fn = kernels.makekernal(
        "transpose", 
        
        function(this:IKernelFunctionThis, a:number[], shape:number[], shape_len:number, step:number[], _step:number[]){            
            let res = 0; 
            for(let sh = 0; sh < shape_len; sh++){
                let inter = shape[sh] * step[sh];
                let inter2 = Math.floor( (this.thread.x % inter) / step[sh] );
                res += inter2 * _step[sh]
            }      

            return a[res];
        },{
            output:[shape.reduce((a, b) => a*b)],
        }        
    )
    
    let res = fn(a, shape, shape.length, step, _step) ;
    
    return res;
}


export function transpose<arr>(a:tensor<arr>, dimension?:number[]):tensor<arr>{
    const dim:number[] = dimension
    ? dimension.length != 0 
        ? dimension 
        : a.shape.map((v:number, i:number):number => i).reverse()
    : a.shape.map((v:number, i:number):number => i).reverse();

    const res = _transpose_main(
        a.data,
        a.shape,
        _cstep(a.shape),
        dim,
    );
    
    const shape = _cstep_change(a.shape, dim);

    return new tensor(res, shape);
}


// Matrix mul


function _mat_mul_2d(a:number[], a_shape:number[], b:number[], b_shape:number[]):number[]{  
    let col_step:number = a_shape[a_shape.length - 1];
    
    const dim:number[] = b_shape.map((a:number, i:number):number => i).reverse();
    let b_data:number[] = _transpose_main(
        b, dim, _cstep_change(b_shape, dim), _cstep_change(_cstep(b_shape), dim)
    );
    let bShape = _cstep_change(b_shape, dim);
    
    let res:number[] = [];

    for (let r:number = 0; r < a.length / col_step; r++) {
        
        for(let c:number = 0; c < b_shape[b_shape.length - 1]; c++){
            const a_m:number[] = a.slice(r * col_step, r * col_step + col_step);
            const b_m:number[] = b_data.slice(c * col_step, c * col_step + col_step);
                    
            res.push(
                a_m.map((a:number, i:number):number => a * b_m[i]).reduce((a:number, b:number):number => a + b)
            );
        }

    }

    return res;
}