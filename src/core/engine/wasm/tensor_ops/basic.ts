import { get_ops } from "../ops";
import { TensorView as Tensor } from "../../tensor";
import { Module_Functions } from "../Emscripton";

export function add<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{    
    let res_tensor_address = get_ops("add_tensor")(a.Memory_address, b.Memory_address);
    return new Tensor([], [], res_tensor_address);
}

export function sub<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    let res_tensor_address = get_ops("sub_tensor")(a.Memory_address, b.Memory_address);
    return new Tensor([], [], res_tensor_address);    
}

export function multiply<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    let res_tensor_address = get_ops("multiply_tensor")(a.Memory_address, b.Memory_address);
    return new Tensor([], [], res_tensor_address);    
}