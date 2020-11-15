import { IKernelFunctionThis } from "gpu.js";
import{ tensor } from '../tensor';
import { kernels } from "./kernel";

export function add<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{    
    const fn = kernels.makekernal("add", function(this:IKernelFunctionThis, a:number[], b:number[]){
        return a[this.thread.x] + b[this.thread.x];
    }, {output:[a.data.length]})

    let res = fn(a.data, b.data);
    console.log(res)
    return new tensor(res, a.shape);    
}

export function sub<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{
    const fn = kernels.makekernal("sub", function(this:IKernelFunctionThis, a:number[], b:number[]){
        return a[this.thread.x] - b[this.thread.x];
    }, {output:[a.data.length]})

    let res = fn(a.data, b.data);
    return new tensor(res, a.shape);      
}

export function multiply<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{
    const fn = kernels.makekernal("multiply", function(this:IKernelFunctionThis, a:number[], b:number[]){
        return a[this.thread.x] * b[this.thread.x];
    }, {output:[a.data.length]})

    let res = fn(a.data, b.data);
    return new tensor(res, a.shape);     
}