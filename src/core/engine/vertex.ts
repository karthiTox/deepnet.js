import { tensor } from "./tensor";

export class vertex<a>{
    constructor(
        public tensor_:tensor<a>, 
        public parents_?:vertex<a>[],
        public grad_:tensor<a> = new tensor(tensor_.data.map((v:number) => 0), tensor_.shape),
    ){

    }
    
    back():void{ 

    }
}