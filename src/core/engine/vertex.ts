import { Tensor, TensorView, Tensor_interface, Tensor_types } from "./Tensor";
import { get_ops } from "./wasm/ops";

import { current_backend } from './backend';
import { isTensor, isTensorView } from "./checks";
import { on_vertex } from "./memory";

interface vertex_interface<a>{
    tensor_?:Tensor_types<a>,     
    grad_:Tensor_types<a>,
    setDestroy(y:boolean):void,
    print():void;
    destroy():void;
}

export class Vertex<a> implements vertex_interface<a>{
    constructor(
        public tensor_:Tensor<a>, 
        public parents_:Vertex<a>[] = [],
        public grad_:Tensor<a> = new Tensor(tensor_.data.map((v:number) => 0), tensor_.shape),
        public name:string = "",
    ){ 

    }
    
    back():void{ 

    }

    print(){
        if(this.name) console.log(this.name)
        this.tensor_.print();
    }

    set_grad<a>(grad:Tensor<a>){
        this.grad_ = grad;
    }

    setDestroy(y:boolean){}

    destroy(){}
}

/**
 * Creates a new vertex with the provided initial tensor.
 * @param tensor Initial value for the tensor.
 * @param parents Parents of the resultant vertex, it will be filled when use the tensor operations.
 * @param grad Derivatives of this resultant tensor, it will be filled while backpass
 * @param name Name of the vertex.
 */
export function vertex<a>(
    tensor:Tensor<a>|TensorView<a>, parents?:Vertex<a>[], grad?:Tensor<a>, name?:string,
){

    switch (current_backend) {
        default:
        case "CPU":
            if(isTensor(tensor))
            return new Vertex<a>(
                tensor, 
                parents, 
                grad, 
                name
            );
            else
            throw new Error("Tensor is needed")
           
        case "WASM":           
            if(isTensorView(tensor))
            return new VertexView<a>(
                tensor,
            );
            else
            throw new Error("TensorView is needed")
    }
}


export class VertexView<a> implements vertex_interface<a>{
    public Memory_address:number = 0;
    public isdestroyed:boolean = false;

    public grad_:TensorView<a>;

    constructor(
        public tensor_?:TensorView<a>,
        memory_address?:number,        
    ){ 
        if(memory_address){
            this.Memory_address = memory_address;            
            this.grad_ = new TensorView([], [], get_ops("get_grad")(this.Memory_address));
            if(!tensor_){
                this.tensor_ = new TensorView([], [], get_ops("get_tensor")(this.Memory_address));
            }
        }else{
            if(tensor_) {
                this.Memory_address = get_ops("create_vertex")(tensor_.Memory_address);            
                this.grad_ = new TensorView([], [], get_ops("get_grad")(this.Memory_address));
            }else{
                throw new Error("tensor is not given")
            }
        }

        on_vertex.emit("created", this)
    }

    print(){       
        this.tensor_?.print();
    }

    setDestroy(y:boolean){        
        get_ops("set_destroy")(this.Memory_address, y?1:0);
    }

    destroy(){ 
        if(!this.isdestroyed) {
            if(!this.tensor_?.isdestroyed){
                this.tensor_?.destroy();
            }   
    
            this.grad_.destroy();
            get_ops("destroy_vertex")(this.Memory_address);
            this.isdestroyed = true;
        }        
	}
}

export type Vertex_types<arr> = Vertex<arr> | VertexView<arr>;
