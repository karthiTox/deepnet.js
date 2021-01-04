import { TensorView as Tensor } from '../../Tensor';
import * as wasm from "../ops";

export function transpose<arr>(a:Tensor<arr>, dimension?:number[]):Tensor<arr>{
    let res_tensor_address:number;
    if(dimension){
        let mem = wasm.memory_allocator();
        mem.allocate_array(dimension, "HEAPF64");
        res_tensor_address = wasm.get_ops("transpose_dim_tensor")(a.Memory_address, mem.buffer, dimension.length);
        mem.free();
    }else{        
        res_tensor_address = wasm.get_ops("transpose_no_dim_tensor")(a.Memory_address);        
    }

    return new Tensor([], [], res_tensor_address);
}

export function matmul<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    let res_tensor_address = wasm.get_ops("matmul_tensor")(a.Memory_address, b.Memory_address);
    return new Tensor([], [], res_tensor_address);
}
