import { isVertex } from "./checks";
import { sub } from "./cpu/_ops_entry";
import { Tensor } from "./tensor";
import { Vertex } from "./Vertex";

/**
 * This will Compute the gradient (derivatives) of the current vertex's tensor (tensor_) and 
 * adds the results with grad_ (grad_ is initialized with value (0)).
 * 
 * grad_ must be zero before calling it.
 * 
 * The graph which is constructed while the forword operation is differentiated using chain rule. 
 *
 * @param res Resultant vertex or Starting vertex.
 * @param initial_grad Initial grad or derivative to start with.
 */
export function backpass<a>(res:Vertex<a>, initial_grad?:Tensor<any>){
    if(!isVertex(res)) throw new Error("backpass will only works with vertex");
    if(initial_grad) res.grad_ = initial_grad;
    
    res.back();
    if(res.parents_){
        res.parents_.forEach((p) => {
            backpass(p);
        })
    }
}

/**
 * This will update the tensor with new values (grad_).
 * this should be called after backpass.
 * 
 * @param res Resultant vertex or Starting vertex.
 * @param rate Learning Rate
 */
export function update_loss<a>(res:Vertex<a>, rate:number = 0.04){     
    if(!isVertex(res)) throw new Error("update_loss will only works with vertex");

    for(let i = 0; i < res.tensor_.data.length; i++){
        const val = (res.grad_.data[i] * rate);    
        res.tensor_.data[i] -=  val ? val : 0;
    }

    if(res.parents_){
        res.parents_.forEach((p) => {
            update_loss(p, rate);
        })
    }
}


/**
 * This will Reset the grad (grad_).
 * this should be called after update_loss.
 * 
 * @param res Resultant vertex or Starting vertex.
 */
export function grad_zero<a>(res:Vertex<a>){
    if(!isVertex(res)) throw new Error("grad_zero will only works with vertex");

    res.grad_.data = res.grad_.data.map(v => 0);
    if(res.parents_){
        res.parents_.forEach((p) => {
            grad_zero(p);
        })
    }
}


/**
 * This will detach the graph.
 * this should be called at end.
 * 
 * @param res Resultant vertex or Starting vertex.
 */
export function detach<a>(res:Vertex<a>){
    if(!isVertex(res)) throw new Error("detach will only works with vertex");

    if(res.parents_){
        res.parents_.forEach((p) => {
            detach(p);
        })
    }

    if(res.parents_){
        res.parents_.forEach((v, i) => {
            if(res.parents_) delete res.parents_[i];
        });        
    }
}

/**
 * This method will visits each vertex of the graph and prints the tensor_ or grad_
 * @param res Resultant vertex or Starting vertex.
 * @param key key to print, "tensor_" | "grad_"
 */
export function traversal<a>(res:Vertex<a>, key:"tensor_"|"grad_"|"fully" = "tensor_"){
    if(!isVertex(res)) throw new Error("traversal will only works with vertex");

    if(!res.parents_)
        if(res.name) console.log(res.name)
        if(key != "fully") res[key].print();
        if(key == "fully") console.log(res)
    if(res.parents_){
        res.parents_.forEach((p) => {
            traversal(p, key);
        })
    }
}