import * as cpu_tensor_ops from "./cpu/tensor_ops/tensor_ops_entry";
import * as cpu_vector_ops from "./cpu/vertex_ops/vertex_ops_entry";

import * as wasm from "./wasm/import_wasm";
import * as ems from "./wasm/Emscripton";
import { TensorView } from "./tensor";

export enum backends{
    CPU,
    WASM
}

class Backend{
    private current_backend:backends = backends.CPU;
    
    
    public tensor_ops = cpu_tensor_ops;
    public vector_ops = cpu_vector_ops;

    constructor(type:backends){
        if(type == backends.WASM){
            this.build_wasm();
        }
    }


    public setBackend(type:backends){
        switch(type){
            case backends.CPU: this.build_cpu(); break;
            case backends.WASM: this.current_backend = backends.WASM; break;
            default: this.current_backend = backends.WASM; break;
        }
    }

    private build_cpu(){
        this.current_backend = backends.CPU;
        this.tensor_ops = cpu_tensor_ops;
        this.vector_ops = cpu_vector_ops;
    }

    private isWasmIntialize = false;
    
    private build_wasm(){
        wasm.module().then((wasm_module:ems.Module_) => {
            this.isWasmIntialize = true;
                    
            
        })
    }

}

export const b = new Backend(backends.WASM);