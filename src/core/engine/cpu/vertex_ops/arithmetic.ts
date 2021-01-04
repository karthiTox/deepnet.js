import * as tensor_ops from '../tensor_ops/tensor_ops_entry';
import {Vertex} from "../../Vertex";
import {Tensor} from "../../tensor";
import { applyfn } from "./apply_fn";
import { multiply } from './basic';

export function floor<arr>(a:Vertex<arr>):Vertex<arr>{  
    let fn = (z:number)=>Math.floor(z);
    let h = 0.05;
    return applyfn(a, fn, (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h));
}

export function ceil<arr>(a:Vertex<arr>):Vertex<arr>{  
    let fn = (z:number)=>Math.ceil(z);
    let h = 0.0005;
    return applyfn(a, fn, (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h));

}


export function round<arr>(a:Vertex<arr>):Vertex<arr>{  
    let fn = (z:number)=>Math.round(z);
    let h = 0.05;
    return applyfn(a, fn, (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h));
}


export function neg<arr>(a:Vertex<arr>):Vertex<arr>{  
    return multiply(
           a, 
           new Vertex(
               new Tensor(new Array(a.tensor_.data.length).fill(-1), a.tensor_.shape)
           )
       );  
}


export function cos<arr>(a:Vertex<arr>):Vertex<arr>{      
    
    let h = 0.05;
    return applyfn(a, 
        (z:number)=>Math.cos(z), 
        (z:number)=>-1*Math.sin(z)
    )

}


export function sin<arr>(a:Vertex<arr>):Vertex<arr>{      
    
    let h = 0.05;
    return applyfn(a, 
        (z:number)=>Math.sin(z), 
        (z:number)=>Math.cos(z)
    )

}

export function tan<arr>(a:Vertex<arr>):Vertex<arr>{      
    let h = 0.05;
    return applyfn(a, 
        (z:number)=>Math.tan(z), 
        (z:number)=>1/Math.cos(z)**2,
    )
}


export function sqrt<arr>(a:Vertex<arr>):Vertex<arr>{      

   let h = 0.05;
   return applyfn(a, 
       (z:number)=>Math.sqrt(z), 
       (z:number)=>0.5 * ( z**-0.5),
   )

}


export function recp<arr>(a:Vertex<arr>):Vertex<arr>{      
    
    let h = 0.05;
    return applyfn(a, 
        (z:number)=>1/z, 
        (z:number)=>(z**-2),
    )
    
}



export function max<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{      
      
    
    let map:number[] = [];
    
    let res_arr =  a.tensor_.data.map((ad, i) => {
        let bd = b.tensor_.data[i]
        if(ad > bd){
            map[i] = 0;
            return ad;
        }else{
            map[i] = 1;
            return bd;
        }
    })        

    let res = new Vertex(new Tensor(res_arr, a.tensor_.shape));
    
    res.back = ()=>{
        const a_grad_arr = res.grad_.data.map((g, i) => map[i] == 0 ? g : 0 );
        const b_grad_arr = res.grad_.data.map((g, i) => map[i] == 1 ? g : 0 );

        a.grad_ = tensor_ops.add(a.grad_, new Tensor(a_grad_arr, res.grad_.shape));
        b.grad_ = tensor_ops.add(b.grad_, new Tensor(b_grad_arr, res.grad_.shape));
    }
            
    return res;
    
}

export function min<arr>(a:Vertex<arr>, b:Vertex<arr>):Vertex<arr>{      

    let map:number[] = [];
    
    let res_arr =  a.tensor_.data.map((ad, i) => {
        let bd = b.tensor_.data[i]
        if(ad < bd){
            map[i] = 0;
            return ad;
        }else{
            map[i] = 1;
            return bd;
        }
    })        
    
    let res = new Vertex(new Tensor(res_arr, a.tensor_.shape));
    
    res.back = ()=>{
        const a_grad_arr = res.grad_.data.map((g, i) => map[i] == 0 ? g : 0 );
        const b_grad_arr = res.grad_.data.map((g, i) => map[i] == 1 ? g : 0 );
    
        a.grad_ = tensor_ops.add(a.grad_, new Tensor(a_grad_arr, res.grad_.shape));
        b.grad_ = tensor_ops.add(b.grad_, new Tensor(b_grad_arr, res.grad_.shape));
    }
            
    return res;
    
}