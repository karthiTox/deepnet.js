import { tensor, Tensor_types } from "./tensor";
import * as random from "./util/random";

function cal_size(shape:number[]){
    return shape.reduce((a,b)=>a*b);
}

export function rand(shape:number[]):Tensor_types<any>{
    return tensor(random.rand(cal_size(shape)), shape);
}

export function zeros(shape:number[]):Tensor_types<any>{
    return tensor(new Array(cal_size(shape)).fill(0), shape);
}

export function ones(shape:number[]):Tensor_types<any>{
    return tensor(new Array(cal_size(shape)).fill(1), shape);
}

export function fill(shape:number[], value:number):Tensor_types<any>{
    return tensor(new Array(cal_size(shape)).fill(value), shape);
}