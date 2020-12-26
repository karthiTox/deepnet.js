import { Tensor } from "../Tensor";
import { kernel } from "./kernel";

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
    
    const fn = kernel.makekernal(
        "transpose", 
        
        function(this:any, a:number[], shape:number[], step:number[], _step:number[]){            
            let res = 0; 
            for(let sh = 0; sh < this.constants.shape_length; sh++){
                let inter = shape[sh] * step[sh];
                let inter2 = Math.floor( (this.thread.x % inter) / step[sh] );
                res += inter2 * _step[sh]
            }      

            return a[res];
        },{
            output:[shape.reduce((a, b) => a*b)],
            constants: {
                shape_length: shape.length
            }
        }        
    )
    
    let res = fn(a, shape, step, _step) ;
    
    return res;
}


export function transpose<arr>(a:Tensor<arr>, dimension?:number[]):Tensor<arr>{
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

    return new Tensor(res, shape);
}


// Matrix mul

function _mat_mul_2d(a:number[], a_shape:number[], b:number[], b_shape:number[]):number[]{  
    let col_step:number = a_shape[a_shape.length - 1];
    
    const dim:number[] = b_shape.map((a:number, i:number):number => i).reverse();
    let b_data = _transpose_main(b, b_shape, _cstep(b_shape), dim);
    
    const r = a.length / col_step;
    const c = b_shape[b_shape.length - 1];

    let fn = kernel.makekernal(
        "matmul2d", 
        function (this:any, a:number[], b:number[]){
            let start = this.thread.x * this.constants.col_len;        
            let start2 = this.thread.y * this.constants.col_len; 
        
            let sum = 0;
            for (let i = 0; i < this.constants.col_len; i++) {
                sum += a[i + start] * b[i + start2];
            }
            return sum;
        }, {
            output:[r, c],
            constants:{
                col_len: col_step
            }
    })

    const res:number[] = [];
    let arr = fn(a, b_data) as number[][];
    arr.forEach(r => {
        r.forEach(c => res.push(c))
    })

    return res;
}

function _split(a:number[], aShape:number[], b:number[], bShape:number[]):number[]{
    let a_shape:number[] = aShape.slice(aShape.length - 2);
    let b_shape:number[] = bShape.slice(bShape.length - 2);

    let tot_el_a:number = a_shape[0] * a_shape[1];
    let tot_el_b:number = b_shape[0] * b_shape[1];

    const res:number[] = [];

    const i_len = a.length / tot_el_a;

    for (let i = 0; i < a.length / tot_el_a; i++) {                            
        _mat_mul_2d(
            a.slice(i * tot_el_a, i * tot_el_a + tot_el_a), a_shape,
            b.slice(i * tot_el_b, i * tot_el_b + tot_el_b), b_shape
        ).forEach(v => res.push(v))                                      
    }

    return res;
}

export function matmul<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    const res = _split(a.data, a.shape, b.data, b.shape)
    const shape = Array.from(a.shape) 
    shape[shape.length - 1] = b.shape[b.shape.length - 1];

    return new Tensor(res, shape);
}