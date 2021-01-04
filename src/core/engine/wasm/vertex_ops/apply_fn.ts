import { VertexView as Vertex } from "../../vertex";
import { get_ops } from "../ops";
import { codes } from "../tensor_ops/tensor_ops_entry";

export function applyfn<arr>(a:Vertex<arr>, code:codes = codes.sig):Vertex<arr>{
    let res_vertex_address = get_ops("applyfn_vertex")(a.Memory_address, code.valueOf());    
    return new Vertex(undefined, res_vertex_address);
}