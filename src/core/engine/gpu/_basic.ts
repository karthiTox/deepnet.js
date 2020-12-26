import { IKernelFunctionThis } from "gpu.js";
import{ Tensor } from '../Tensor';
import { kernel } from "./kernel";

export function add<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{    
    const fn = kernel.makekernal("add", function(this:IKernelFunctionThis, a:number[], b:number[]){
        return a[this.thread.x] + b[this.thread.x];
    }, {output:[a.data.length]})

    let res = fn(a.data, b.data);
    return new Tensor(res, a.shape);    
}

export function sub<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    const fn = kernel.makekernal("sub", function(this:IKernelFunctionThis, a:number[], b:number[]){
        return a[this.thread.x] - b[this.thread.x];
    }, {output:[a.data.length]})

    let res = fn(a.data, b.data);
    return new Tensor(res, a.shape);      
}

export function multiply<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    const fn = kernel.makekernal("multiply", function(this:IKernelFunctionThis, a:number[], b:number[]){
        return a[this.thread.x] * b[this.thread.x];
    }, {output:[a.data.length]})

    let res = fn(a.data, b.data);
    return new Tensor(res, a.shape);     
}