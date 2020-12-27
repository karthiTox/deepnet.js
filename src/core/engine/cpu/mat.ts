import { Tensor } from '../Tensor';
import { multiply } from './basic';

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

export function transpose<arr>(a:Tensor<arr>, dimension?:number[]):Tensor<arr>{
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

    return new Tensor(res, shape);
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

export function matmul<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    
    if(a.shape.length > 1 && b.shape.length > 1){
        if(a.shape[a.shape.length - 1] != b.shape[a.shape.length - 2]) 
            throw new Error("number of columns in first tensor should equal to number of rows in second tensor")
    
        if(a.shape.length > 2){
            for (let s = 0; s < a.shape.length-2; s++) {        
                if(a.shape[s] != b.shape[s])
                    throw new Error("two tensor are not equal")
            }
        }
    
    }else{
        return multiply(a, b)
    }

    

    const res = _split(a.data, a.shape, b.data, b.shape)
    const shape = Array.from(a.shape) 
    shape[shape.length - 1] = b.shape[b.shape.length - 1];

    return new Tensor(res, shape);
}

export function concat<arr>(a:Tensor<arr>, b:Tensor<arr>, axis:number):Tensor<arr>{
    const _a = _split_till(a.data, a.shape, axis);
    const _b = _split_till(b.data, b.shape, axis);

    const res = [];

    for(let _sa = 0; _sa < _a.length; _sa++){
        res.push(_a[_sa]);
        res.push(_b[_sa]);
    }

    const shape = Array.from(a.shape);
    shape[axis] += b.shape[axis];

    
    return new Tensor(res, shape);
}

export function disjoin<arr>(a:Tensor<arr>, axis:number, ratio:number):Tensor<arr>[]{
    const _a = _split_till(a.data, a.shape, axis);

    const res1 = [];
    const res2 = [];
    
    for(let _sa = 0; _sa < _a.length; _sa++){
        const middle = _a[_sa].length * ratio
        res1.push(_a[_sa].slice(0, middle));        
        res2.push(_a[_sa].slice(middle));        
    }

    const shape1 = Array.from(a.shape);
    const shape2 = Array.from(a.shape);
    shape1[axis] *= ratio;
    shape2[axis] = shape2[axis] - (shape2[axis] * ratio);

    return [new Tensor(res1, shape1), new Tensor(res2, shape2)];
}

function _split_till(val:number[], shape:number[], axis:number){
    let a_shape = shape.slice(axis);

    let tot_el = a_shape.reduce((a, b) => a * b);

    const res = [];
    for (let i = 0; i < val.length / tot_el; i++) {           
        res.push(
            val.slice(i * tot_el, i * tot_el + tot_el)
        )                                
    }
    return res;
}