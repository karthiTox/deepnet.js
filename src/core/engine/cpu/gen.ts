import { Tensor } from "../Tensor";
import { avb_rand, getRand } from "./random";

/**
 * Creates a Tensor with random elements (it uses Math.random() to generate random values).
 * @param shape the output tensor shape.
 * 
 * @returns Tensor.
 */
export function rand(shape:number[], type?:avb_rand){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(getRand(type));
    }
    
    return new Tensor(res, shape);    
}

/**
 * Creates a Tensor with an element zero (0).
 * @param shape the output tensor shape.
 * 
 * @returns Tensor.
 */
export function zeros(shape:number[]){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(0);
    }

    return new Tensor(res, shape);    
}

/**
 * Creates a Tensor with an element One (1).
 * @param shape the output tensor shape.
 * 
 * @returns Tensor.
 */
export function ones(shape:number[]){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(1);
    }

    return new Tensor(res, shape);    
}

/**
 * Creates a Tensor filled with a value (number).
 * @param shape the output tensor shape.
 * @param value The number to fill the tensor with.
 * 
 * @returns Tensor.
 */
export function fill(shape:number[], value:number){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(value);
    }

    return new Tensor(res, shape);    
}


/**
 * Creates a Tensor filled with a return value of the method (fn).
 * @param shape The output tensor shape.
 * @param fn The Tensor is filled with a return value of this method.
 * 
 * @returns Tensor.
 */
export function fillfn(shape:number[], fn=():number=>{return 1}){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(fn());
    }

    return new Tensor(res, shape);    
}