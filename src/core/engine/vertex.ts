import { Tensor, TensorView, Tensor_interface } from "./Tensor";
import { get_ops } from "./wasm/ops";

export class Vertex<a>{
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
}

/**
 * Creates a new vertex with the provided initial tensor.
 * @param tensor Initial value for the tensor.
 * @param parents Parents of the resultant vertex, it will be filled when use the tensor operations.
 * @param grad Derivatives of this resultant tensor, it will be filled while backpass
 * @param name Name of the vertex.
 */
export function vertex<a>(
    tensor:Tensor<a>, parents?:Vertex<a>[], grad?:Tensor<a>, name?:string,
){
    return new Vertex<a>(
        tensor, 
        parents, 
        grad, 
        name
    );
}


export class VertexView<a>{
    public Memory_address:number = 0;
    
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
    }

    print(){       
        this.tensor_?.print();
    }

    setDestroy(y:boolean){        
        get_ops("set_destroy")(this.Memory_address, y?1:0);
    }

    destroy(){        
        this.grad_.destroy();
		get_ops("destroy_vertex")(this.Memory_address);
	}
}

export type Vertex_types<arr> = Vertex<arr> | VertexView<arr>;
