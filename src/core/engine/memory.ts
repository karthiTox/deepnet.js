import { get_ops } from "./wasm/ops";

class dn_emitter{
    private callbacks:{
        [events:string]:{
            [id:number]:((data:any)=>any)
        };
    } = {};

    constructor(){}

    on(event:string, id:number, cb:(data:any)=>any){
        if(!this.callbacks[event]) 
            this.callbacks[event] = {};
        
        this.callbacks[event][id] = cb;
    }

    remove(event:string, id:number){      
        delete this.callbacks[event][id]
    }

    emit(event:string, data:any){
        let cbs = this.callbacks[event]
        if(cbs){
            for(const id in cbs){
                cbs[id](data);
            }
        }
    }
}

export let on_tensor = new dn_emitter();
export let on_vertex = new dn_emitter();

export class Manager{
    private allocated:any[] = [];
    private id:number = Math.ceil(Math.random()*10000)
    
    constructor(private emitter:dn_emitter){
        this.emitter.on("created", this.id, (tensor:any)=>{
            this.allocated.push(tensor);
        })
    }

    public close(){
        this.emitter.remove("created", this.id);

        this.allocated.forEach((tensor, i) => {
            tensor.destroy();
            delete this.allocated[i];
        })
        this.allocated = [];
    }
}

export function tidy(func:()=>any){    
    let tensor_manager = new Manager(on_tensor);
    let vertex_manager = new Manager(on_vertex);
    let result = func();
    tensor_manager.close();
    vertex_manager.close();
    return result;
}

export function wasm_heap_used(){
    return get_ops("get_memory_usage")();
}