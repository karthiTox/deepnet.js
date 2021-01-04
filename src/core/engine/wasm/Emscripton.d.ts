import { TensorView } from "../tensor";

export interface Module_ extends EmscriptenModule {	
    ccall: typeof ccall;
    cwrap: typeof cwrap;
    
    _malloc(a:number):number;
    _free(a:number):void;

    HEAP8: Int8Array;
    HEAP16: Int16Array;
    HEAP32: Int32Array;
    HEAPU8: Uint8Array;
    HEAPU16: Uint16Array;
    HEAPU32: Uint32Array;
    HEAPF32: Float32Array;
    HEAPF64: Float64Array;

     _create_tensor(tensor:number):number;
    _destroy_tensor(tensor:number):number;
    _set_data(tensor:number, value:number, data_length:number):void;
    _set_shape(tensor:number, value:number, shape_length:number):void;
    _print(tensor:number, type:0|1|2|3, index:number):void;
    _get_data_length(tensor:number):number;
    _get_data(tensor:number):number;
    _destroy_array(array:number):number;
    _get_shape_length(tensor:number):number;
    _get_shape(tensor:number):number;
    _add_tensor(a:number, b:number):number;
    _sub_tensor(a:number, b:number):number;
    _multiply_tensor(a:number, b:number):number;
    _matmul_tensor(a:number, b:number):number;
    _transpose_no_dim_tensor(a:number):number;
    _transpose_dim_tensor(a:number, dim:number, length:number):number;
    _applyfn_tensor(a:number, code:number):number;
    _create_vertex(tensor:number):number;
    _destroy_vertex(vertex:number):number;
    _set_destroy(vertex:number):void;
    _get_tensor(vertex:number):number;
    _get_grad(vertex:number):number;
    _add_vertex(a:number, b:number):number;
    _sub_vertex(a:number, b:number):number;
    _multiply_vertex(a:number, b:number):number;
    _matmul_vertex(a:number, b:number):number;
    _transpose_no_dim_vertex(a:number):number;
    _transpose_dim_vertex(a:number, dim:number, length:number):number;
    _applyfn_vertex(a:number, code:number):number;
    _graph_backpass(a:number):number;
    _graph_update_loss(a:number):number;
    _graph_detach(a:number):number;
    _get_memory_usage():number;
}

interface wasm_tensor_ops{
  add(a:TensorView, b:TensorView):TensorView;
  sub(a:TensorView, b:TensorView):TensorView;
  multiply(a:TensorView, b:TensorView):TensorView;
}

export type Module_Functions = 
"create_tensor"| 
"destroy_tensor"| 
"set_data"|
"set_shape"|
"print"|
"get_data_length"|
"get_data"|
"destroy_array"|
"get_shape_length"|
"get_shape"|
"add_tensor"|
"sub_tensor"|
"multiply_tensor"|
"matmul_tensor"|
"transpose_no_dim_tensor"|
"transpose_dim_tensor"|
"applyfn_tensor"|
"create_vertex"|
"destroy_vertex"|
"set_destroy"|
"get_tensor"|
"get_grad"|
"add_vertex"|
"sub_vertex"|
"multiply_vertex"|
"matmul_vertex"|
"transpose_no_dim_vertex"|
"transpose_dim_vertex"|
"applyfn_vertex"|
"graph_backpass"|
"graph_update_loss"|
"graph_detach"|
"get_memory_usage";





























/*
{
  ready: Promise { [Circular] },
  inspect: [Function],
  preloadedImages: {},
  preloadedAudios: {},
  ___wasm_call_ctors: [Function: 13],
  _create_tensor: [Function],
  _destroy_tensor: [Function],
  _set_data: [Function],
  _set_shape: [Function],
  _print: [Function],
  _get_data_length: [Function],
  _get_data: [Function],
  _destroy_array: [Function],
  _get_shape_length: [Function],
  _get_shape: [Function],
  _add_tensor: [Function],
  _sub_tensor: [Function],
  _multiply_tensor: [Function],
  _matmul_tensor: [Function],
  _transpose_no_dim_tensor: [Function],
  _transpose_dim_tensor: [Function],
  _applyfn_tensor: [Function],
  _create_vertex: [Function],
  _destroy_vertex: [Function],
  _set_destroy: [Function],
  _get_tensor: [Function],
  _get_grad: [Function],
  _add_vertex: [Function],
  _sub_vertex: [Function],
  _multiply_vertex: [Function],
  _matmul_vertex: [Function],
  _transpose_no_dim_vertex: [Function],
  _transpose_dim_vertex: [Function],
  _applyfn_vertex: [Function],
  _graph_backpass: [Function],
  _graph_update_loss: [Function],
  _graph_detach: [Function],
  _get_memory_usage: [Function],
  _malloc: [Function],
  _free: [Function],
  ___errno_location: [Function],
  stackSave: [Function],
  stackRestore: [Function],
  stackAlloc: [Function],
  _setThrew: [Function],
  dynCall_viijii: [Function],
  dynCall_jiji: [Function],
  dynCall_iiiiij: [Function],
  dynCall_iiiiijj: [Function],
  dynCall_iiiiiijj: [Function],
  ccall: [Function: ccall],
  cwrap: [Function: cwrap],
  run: [Function: run],
  asm: [Object: null prototype] {
    memory: Memory [WebAssembly.Memory] {},
    __indirect_function_table: Table [WebAssembly.Table] {},
    __wasm_call_ctors: [Function: 13],
    create_tensor: [Function: 14],
    destroy_tensor: [Function: 15],
    set_data: [Function: 16],
    set_shape: [Function: 18],
    print: [Function: 19],
    get_data_length: [Function: 20],
    get_data: [Function: 21],
    destroy_array: [Function: 22],
    get_shape_length: [Function: 23],
    get_shape: [Function: 24],
    add_tensor: [Function: 25],
    sub_tensor: [Function: 26],
    multiply_tensor: [Function: 27],
    matmul_tensor: [Function: 28],
    transpose_no_dim_tensor: [Function: 29],
    transpose_dim_tensor: [Function: 30],
    applyfn_tensor: [Function: 31],
    create_vertex: [Function: 32],
    destroy_vertex: [Function: 33],
    set_destroy: [Function: 34],
    get_tensor: [Function: 35],
    get_grad: [Function: 36],
    add_vertex: [Function: 37],
    sub_vertex: [Function: 38],
    multiply_vertex: [Function: 39],
    matmul_vertex: [Function: 40],
    transpose_no_dim_vertex: [Function: 41],
    transpose_dim_vertex: [Function: 42],
    applyfn_vertex: [Function: 43],
    graph_backpass: [Function: 44],
    graph_update_loss: [Function: 45],
    graph_detach: [Function: 46],
    get_memory_usage: [Function: 47],
    malloc: [Function: 897],
    free: [Function: 898],
    __errno_location: [Function: 265],
    stackSave: [Function: 913],
    stackRestore: [Function: 914],
    stackAlloc: [Function: 915],
    setThrew: [Function: 916],
    dynCall_viijii: [Function: 917],
    dynCall_jiji: [Function: 918],
    dynCall_iiiiij: [Function: 919],
    dynCall_iiiiijj: [Function: 920],
    dynCall_iiiiiijj: [Function: 921]
  },
  HEAP8: Int8Array(16777216) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 16777116 more items
  ],
  HEAP16: Int16Array(8388608) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 8388508 more items
  ],
  HEAP32: Int32Array(4194304) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 4194204 more items
  ],
  HEAPU8: Uint8Array(16777216) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 16777116 more items
  ],
  HEAPU16: Uint16Array(8388608) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 8388508 more items
  ],
  HEAPU32: Uint32Array(4194304) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 4194204 more items
  ],
  HEAPF32: Float32Array(4194304) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 4194204 more items
  ],
  HEAPF64: Float64Array(2097152) [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 2097052 more items
  ],
  calledRun: true,
  stdin: undefined,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0,
    ... 2097052 more items
  ],
  calledRun: true,
  stdin: undefined,
  stdout: undefined,
  stderr: undefined
}
*/