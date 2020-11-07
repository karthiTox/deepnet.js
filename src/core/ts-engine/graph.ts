import { vertex } from "./vertex";

export function backpass<a>(res:vertex<a>){
    res.back();
    if(res.parents_){
        res.parents_.forEach((p) => {
            backpass(p);
        })
    }
}


export function traversal<a>(res:vertex<a>){
    res.grad_.print();
    if(res.parents_){
        res.parents_.forEach((p) => {
            traversal(p);
        })
    }
}