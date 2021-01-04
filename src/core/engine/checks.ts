import { Tensor_types } from "./tensor";
import { Vertex_types } from "./vertex";

export function check_shape<arr>(...tensor:Tensor_types<arr>[]){
    for (let t = 1; t < tensor.length; t++) {
        let current_tensor = tensor[t];        
        let previous_tensor = tensor[t - 1];        

        if(current_tensor.shape.length != previous_tensor.shape.length) 
            throw new Error("tensors are in different shape")
        
        for (let s = 0; s < current_tensor.shape.length; s++) {
            if(current_tensor.shape[s] != previous_tensor.shape[s])
                throw new Error("tensors are in different shape")
        }
    }
}

export function isTensor<a>(t:Tensor_types<a>|Vertex_types<a>):t is Tensor_types<a>{
    return (<Tensor_types<a>>t).data !== undefined;
}

export function isVertex<a>(t:Tensor_types<a>|Vertex_types<a>):t is Vertex_types<a>{
    return (<Vertex_types<a>>t).grad_ !== undefined;
}