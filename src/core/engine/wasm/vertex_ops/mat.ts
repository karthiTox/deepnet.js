import { VertexView as Vertex } from '../../vertex';
import * as wasm from "../ops";

export function transpose<arr>(a:Vertex<arr>, dimension?:number[]):Vertex<arr>{
    let res_vertex_address:number;
    if(dimension){
        let mem = wasm.memory_allocator();
        mem.allocate_array(dimension, "HEAPF64");
        res_vertex_address = wasm.get_ops("transpose_dim_vertex")(a.Memory_address, mem.buffer, dimension.length);
        mem.free();
    }else{        
        res_vertex_address = wasm.get_ops("transpose_no_dim_vertex")(a.Memory_address);        
    }

    return new Vertex(undefined, res_vertex_address);
}

export function matmul<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{
    let res_vertex_address = wasm.get_ops("matmul_vertex")(a.Memory_address, b.Memory_address);
    return new Vertex(undefined, res_vertex_address);
}
