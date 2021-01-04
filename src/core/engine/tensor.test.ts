import * as dn from "./engine_entry";
import { Tensor, TensorView } from "./tensor";
import { Vertex, VertexView } from "./vertex";
import Module from "./wasm/wasm-build/test";
import { Module_Functions } from "./wasm/Emscripton";
import { get_ops, ops } from "./wasm/ops";
import * as tensor_ops from "./wasm/tensor_ops/tensor_ops_entry";
import * as vertex_ops from "./wasm/vertex_ops/vertex_ops_entry";
import { codes } from "./wasm/tensor_ops/tensor_ops_entry";































// function fully_connected(input:any, weights:any, biases:any){
//     let res1 = vertex_ops.matmul(input, vertex_ops.transpose(weights));                
//     let res2 = vertex_ops.add(res1, biases);
//     let res = vertex_ops.applyfn(res2, 1);

//     return res;
// }  

// function loss(a:any, y:any){
//     return tensor_ops.sub(a, y);
// }

// Module().then((m:any) => {
//     setTimeout(() => {
        
        
//         console.time("run time");
//         let tw = tensor_ops.rand([5, 2])
//         let w = new VertexView(tw);
//         w.setDestroy(false);
        
//         let tb = tensor_ops.rand([1, 5])        
//         let b = new VertexView(tb);
//         b.setDestroy(false);
        
//         for (let iteration = 0; iteration < 100; iteration++) {
            
//             let ta = tensor_ops.fill([1, 2], 1)        
//             let a = new VertexView(ta);
            
//             let result = fully_connected(a, w, b);
//             let output = dn.tensor([0, 1, 0, 1, 0], [1, 5]);
            
//             dn.backpass(result);
//             dn.update_loss(result, 0.04);
//             dn.grad_zero(result);
//             dn.detach(result);
        
//         }
        
//         let prediction = fully_connected(dn.ones([1, 2]), w.tensor_, b.tensor_)
//         prediction.print();
//         console.timeEnd("run time");
    
        
//     }, 2000);
// });
