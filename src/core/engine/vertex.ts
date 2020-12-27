import { Tensor } from "./Tensor";

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
