import { costfn } from '../../../../old/independent_networks/constructor';
import { tensor } from '../tensor';

// Transpose

function _cstep(shape:number[]):number[]{   
    if(shape.length > 1){
        const current_shape:number[] = [shape.slice(1).reduce((a, b) => a * b)];
        return current_shape.concat(_cstep(shape.slice(1)));
    }else{
        return [1];
    }
}

function _cstep_change(step:number[], dimension:number[]):number[]{    
    if(dimension.length > 0){
        const currentstate:number[] = [step[dimension[0]]];
        return currentstate.concat(_cstep_change(step, dimension.slice(1)));
    }else{
        return [];
    }
}

function _cindex(index:number[], step:number[]):number{
    if(index.length > 0){
        const current_index:number = index[0] * step[0];
        return current_index + _cindex(index.slice(1), step.slice(1));
    }else{
        return 0;
    }
}

function _transpose_main(
    a:number[], 
    dimension:number[], 
    shape:number[], 
    step:number[], 
    len:number = shape.length,
    index:number[] = []
):number[]{            
    const arr:number[] = [];
    for (let s:number = 0; s < (shape[0] || 0); s++) {        
        const ind:number[] = index.concat([s])
        _transpose_main(a, dimension, shape.slice(1), step, len, ind).forEach(el => {
            arr.push(el)
        });
    }
    if(index.length == len){         
        return [a[_cindex(index, step)]]
    }
    return arr
}

export function transpose<arr>(a:tensor<arr>, dimension?:number[]):tensor<arr>{
    const dim:number[] = dimension
    ? dimension.length != 0 
        ? dimension 
        : a.shape.map((v:number, i:number):number => i).reverse()
    : a.shape.map((v:number, i:number):number => i).reverse();

    const res:number[] = _transpose_main(
        a.data,
        dim,
        _cstep_change(a.shape, dim),
        _cstep_change(_cstep(a.shape), dim),
    );
    const shape = _cstep_change(a.shape, dim);

    return new tensor(res, shape);
}

// Mat mul

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

function _split(a:number[], aShape:number[], b:number[], bShape:number[]):number[]{
    let a_shape:number[] = aShape.slice(aShape.length - 2);
    let b_shape:number[] = bShape.slice(bShape.length - 2);

    let tot_el_a:number = a_shape[0] * a_shape[1];
    let tot_el_b:number = b_shape[0] * b_shape[1];

    const res:number[] = [];

    for (let i = 0; i < a.length / tot_el_a; i++) {                            
        _mat_mul_2d(
            a.slice(i * tot_el_a, i * tot_el_a + tot_el_a), a_shape,
            b.slice(i * tot_el_b, i * tot_el_b + tot_el_b), b_shape
        ).forEach(v => res.push(v))                                      
    }

    return res;
}

export function matmul<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{
    const res = _split(a.data, a.shape, b.data, b.shape)
    const shape = Array.from(a.shape) 
    shape[shape.length - 1] = b.shape[b.shape.length - 1];

    return new tensor(res, shape);
}