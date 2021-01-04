import * as tensor_ops from "../tensor_ops/tensor_ops_entry";
import { VertexView as Vertex } from "../../Vertex";

export function rand(shape:number[]):Vertex<any>{
    return new Vertex(tensor_ops.rand(shape));
}

export function zeros(shape:number[]):Vertex<any>{
    return new Vertex(tensor_ops.zeros(shape));
}

export function ones(shape:number[]):Vertex<any>{
    return new Vertex(tensor_ops.ones(shape));
}

export function fill(shape:number[], value:number):Vertex<any>{
    return new Vertex(tensor_ops.fill(shape, value));
}