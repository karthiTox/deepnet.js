import { VertexView as Vertex } from '../../vertex';
import { get_ops } from '../ops';

export function add<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{        
    const res_tensor_address = get_ops("add_vertex")(a.Memory_address, b.Memory_address);    
    return new Vertex(undefined, res_tensor_address);    
}

export function sub<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{  
    const res_tensor_address = get_ops("sub_vertex")(a.Memory_address, b.Memory_address);    
    return new Vertex(undefined, res_tensor_address);    
}

export function multiply<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{  
    const res_tensor_address = get_ops("multiply_vertex")(a.Memory_address, b.Memory_address);    
    return new Vertex(undefined, res_tensor_address);    
}