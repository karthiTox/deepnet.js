import * as gen from "./cpu/gen";
import { Vertex } from "./Vertex";

export function genRan(shape:number[]):Vertex<any>{
    return new Vertex(gen.rand(shape));
}

export function genZero(shape:number[]):Vertex<any>{
    return new Vertex(gen.zeros(shape));
}

export function rand(shape:number[]):Vertex<any>{
    return new Vertex(gen.rand(shape));
}

export function zeros(shape:number[]):Vertex<any>{
    return new Vertex(gen.zeros(shape));
}

export function ones(shape:number[]):Vertex<any>{
    return new Vertex(gen.ones(shape));
}

export function fill(shape:number[], value:number):Vertex<any>{
    return new Vertex(gen.fill(shape, value));
}