import { Tensor, TensorView, Tensor_types } from "./tensor";
import { Vertex, VertexView, Vertex_types } from "./vertex";

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

type input<arr> = Vertex_types<arr>|Tensor_types<arr>;

export function isTensor<a>(t:input<a>):t is Tensor<a>{
    return (
        (<Tensor<a>>t).data !== undefined
        &&
        (<TensorView<a>>t).Memory_address === undefined
    );
}

export function isVertex<a>(t:input<a>):t is Vertex<a>{
    return (
        (<Vertex<a>>t).grad_ !== undefined
        &&
        (<VertexView<a>>t).Memory_address === undefined
    );
}

export function isTensorView<a>(t:input<a>):t is TensorView<a>{
    return (<TensorView<a>>t).Memory_address !== undefined;
}

export function isVertexView<a>(t:input<a>):t is VertexView<a>{
    return (
        (<VertexView<a>>t).Memory_address !== undefined
        &&
        (<VertexView<a>>t).grad_ !== undefined
    );
}