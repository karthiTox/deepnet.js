import { module as Module } from "./import_wasm";
import * as Ems from "./Emscripton";

export let ops:{
    [name:string]:(...arg:any) => any;
} = {};

export function get_ops(name:Ems.Module_Functions){
    return ops[name];
}

export let HEAP:{
    [name:string]:any;
} = {};

Module().then((wasm_module:Ems.Module_)=>{ 
    ops["ccall"] = wasm_module.ccall;
    ops["cwrap"] = wasm_module.ccall;
    ops["_malloc"] = wasm_module._malloc;
    ops["_free"] = wasm_module._free;

    HEAP["HEAP8"] = wasm_module.HEAP8;
    HEAP["HEAP16"] = wasm_module.HEAP16;
    HEAP["HEAP32"] = wasm_module.HEAP32;
    HEAP["HEAPU8"] = wasm_module.HEAPU8;
    HEAP["HEAPU16"] = wasm_module.HEAPU16;
    HEAP["HEAPU32"] = wasm_module.HEAPU32;
    HEAP["HEAPF32"] = wasm_module.HEAPF32;
    HEAP["HEAPF64"] = wasm_module.HEAPF64;
    
    ops["create_tensor"] = wasm_module.cwrap("create_tensor", "number", ["number"]);    
    ops["destroy_tensor"] = wasm_module.cwrap("destroy_tensor", null, ["number"]);
    ops[ "add_vertex"] = wasm_module.cwrap( "add_vertex", "number", ["number", "number"]);
    ops[ "applyfn_tensor"] = wasm_module.cwrap( "applyfn_tensor", "number", ["number", "number"]);
    ops[ "applyfn_vertex"] = wasm_module.cwrap( "applyfn_vertex", "number", ["number", "number"]);
    ops[ "add_tensor"] = wasm_module.cwrap( "add_tensor", "number", ["number", "number"]);
    ops[ "create_tensor"] = wasm_module.cwrap( "create_tensor", "number", [])
    ops[ "create_vertex"] = wasm_module.cwrap( "create_vertex", "number", ["number"])
    ops[ "destroy_array"] = wasm_module.cwrap( "destroy_array", "number", ["number"]);
    ops[ "destroy_tensor"] = wasm_module.cwrap( "destroy_tensor", "number", ["number"]);    
    ops[ "destroy_vertex"] = wasm_module.cwrap( "destroy_vertex", "number", ["number"]);   
    ops[ "get_data"] = wasm_module.cwrap( "get_data", "number", ["number"]);    
    ops[ "get_data_length"] = wasm_module.cwrap( "get_data_length", "number", ["number"]);    
    ops[ "get_grad"] = wasm_module.cwrap( "get_grad", "number", ["number"]);    
    ops[ "get_memory_usage"] = wasm_module.cwrap( "get_memory_usage", "number", []);    
    ops[ "get_shape"] = wasm_module.cwrap( "get_shape", "number", ["number"]);    
    ops[ "get_shape_length"] = wasm_module.cwrap( "get_shape_length", "number", ["number"]);    
    ops[ "get_tensor"] = wasm_module.cwrap( "get_tensor", "number", ["number"]);    
    ops[ "graph_backpass"] = wasm_module.cwrap( "graph_backpass", null, ["number"]);    
    ops[ "graph_detach"] = wasm_module.cwrap( "graph_detach", null, ["number"]);    
    ops[ "graph_update_loss"] = wasm_module.cwrap( "graph_update_loss", null, ["number", "number"]);    
    ops[ "matmul_tensor"] = wasm_module.cwrap( "matmul_tensor", "number", ["number", "number"]);    
    ops[ "matmul_vertex"] = wasm_module.cwrap( "matmul_vertex", "number", ["number", "number"]);    
    ops[ "multiply_tensor"] = wasm_module.cwrap( "multiply_tensor", "number", ["number", "number"]);    
    ops[ "multiply_vertex"] = wasm_module.cwrap( "multiply_vertex", "number", ["number", "number"]);    
    ops[ "print"] = wasm_module.cwrap( "print", null, ["number", "number"]);    
    ops["set_data"] = wasm_module.cwrap( "set_data", null, ["number", "number", "number"]);    
    ops["set_destroy"] = wasm_module.cwrap( "set_destroy", null, ["number", "number"]);    
    ops["set_shape"] = wasm_module.cwrap( "set_shape", null, ["number", "number", "number"]);    
    ops[ "sub_tensor"] = wasm_module.cwrap( "sub_tensor", "number", ["number", "number"]);    
    ops[ "sub_vertex"] = wasm_module.cwrap( "sub_vertex", "number", ["number", "number"]);    
    ops[ "transpose_dim_tensor"] = wasm_module.cwrap( "transpose_dim_tensor", "number", ["number", "number", "number"]);    
    ops[ "transpose_no_dim_tensor"] = wasm_module.cwrap( "transpose_no_dim_tensor", "number", ["number"]);    
    ops[ "transpose_dim_vertex"] = wasm_module.cwrap( "transpose_dim_vertex", "number", ["number", "number", "number"]);  
    ops[ "transpose_no_dim_vertex"] = wasm_module.cwrap( "transpose_no_dim_vertex", "number", ["number"]);    
})

type heapmap =     
"HEAP8"|
"HEAPU8"|
"HEAP16"|
"HEAPU16"|
"HEAP32"|
"HEAPU32"|
"HEAPF32"|
"HEAPF64";

let heapMap = {
    HEAP8 : Int8Array, // int8_t
    HEAPU8 : Uint8Array, // uint8_t
    HEAP16 : Int16Array, // int16_t
    HEAPU16 : Uint16Array, // uint16_t
    HEAP32 : Int32Array, // int32_t
    HEAPU32 : Uint32Array, // uint32_t
    HEAPF32 : Float32Array, // float
    HEAPF64 : Float64Array 
};

export class Memory_allocation{
    public buffer:number = 0;

	allocate_array(array:number[], heapIn:heapmap){		
		const typedArray = new heapMap[heapIn](array.length)
	
	
		for (let i=0; i<array.length; i++) {
			typedArray[i] = array[i];
		}
	
		this.buffer = ops._malloc(typedArray.length * typedArray.BYTES_PER_ELEMENT);
		
		switch (heapIn) {
			case "HEAP8": case "HEAPU8":
				HEAP[heapIn].set(typedArray, this.buffer)
				break
			case "HEAP16": case "HEAPU16":
				HEAP[heapIn].set(typedArray, this.buffer >> 1)
				break
			case "HEAP32": case "HEAPU32": case "HEAPF32":
				HEAP[heapIn].set(typedArray, this.buffer >> 2)
				break
			case "HEAPF64":
				HEAP[heapIn].set(typedArray, this.buffer >> 3)
				break
		}
	
		return this.buffer;
	}

	
	free(){	
		ops._free(this.buffer);
	}

}

export function memory_allocator(){
    return new Memory_allocation();
}

export function get_values(pointer:number, length:number, heapIn:heapmap){
    const arrayData = []

    for (let v=0; v<length; v++) {
        let ptr = pointer/heapMap[heapIn].BYTES_PER_ELEMENT+v;
        arrayData.push(HEAP[heapIn][ptr]);
        
    }

    return arrayData;
}
