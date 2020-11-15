import { sub } from "./cpu/_ops_entry";
import { tensor } from "./tensor";
import { vertex } from "./vertex";

export function backpass<a>(res:vertex<a>){
    res.back();
    if(res.parents_){
        res.parents_.forEach((p) => {
            backpass(p);
        })
    }
}

export function update_loss<a>(res:vertex<a>, aplha:number = 0.04){     
    for(let i = 0; i < res.tensor_.data.length; i++){
        const val = (res.grad_.data[i] * aplha);    
        res.tensor_.data[i] -=  val ? val : 0;
    }

    if(res.parents_){
        res.parents_.forEach((p) => {
            update_loss(p, aplha);
        })
    }
}


export function grad_zero<a>(res:vertex<a>){
    res.grad_.data = res.grad_.data.map(v => 0);
    if(res.parents_){
        res.parents_.forEach((p) => {
            grad_zero(p);
        })
    }
}

export function detach<a>(res:vertex<a>){
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


export function traversal<a>(res:vertex<a>){
    if(!res.parents_)
        res.tensor_.print();
    if(res.parents_){
        res.parents_.forEach((p) => {
            traversal(p);
        })
    }
}