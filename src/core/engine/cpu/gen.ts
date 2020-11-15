import { tensor } from "../tensor";

export function genRan(shape:number[]){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(Math.random());
    }
    
    return new tensor(res, shape);    
}


export function genZero(shape:number[]){
    const size = shape.reduce((a, b) => a*b);
    const res = []
    for (let s = 0; s < size; s++) {
        res.push(0);
    }

    return new tensor(res, shape);    
}