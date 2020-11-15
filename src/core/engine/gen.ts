import * as gen from "./cpu/gen";
import { vertex } from "./vertex";

export function genRan(shape:number[]):vertex<any>{
    return new vertex(gen.genRan(shape));
}

export function genZero(shape:number[]):vertex<any>{
    return new vertex(gen.genZero(shape));
}