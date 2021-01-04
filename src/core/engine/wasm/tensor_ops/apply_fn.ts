import { TensorView as Tensor } from "../../tensor";
import * as wasm from "../ops";

export enum codes{
    sig = 1,
    tanh = 2,
    Relu = 3,
}

export function applyfn<arr>(a:Tensor<arr>, code:codes = codes.sig):Tensor<arr>{
    let res_tensor_address = wasm.get_ops("applyfn_tensor")(a.Memory_address,  code.valueOf());
    
    return new Tensor(
        [],
        [],
        res_tensor_address
    )
}