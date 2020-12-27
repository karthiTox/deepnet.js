import * as ops from './cpu/_ops_entry';
import {Vertex} from "./Vertex";
import {Tensor, tensor} from "./tensor";
import { isTensor, isVertex } from './checks';
import { applyfn } from "./apply_act";
import { multiply } from './basic';

export function floor<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    let fn = (z:number)=>Math.floor(z);
    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, fn, (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h));

    }else if(isTensor(a)){

        return ops.applyfn(a, fn);        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function ceil<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    let fn = (z:number)=>Math.ceil(z);
    
    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, fn, (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h));

    }else if(isTensor(a)){
        return ops.applyfn(a, fn);        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function round<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    let fn = (z:number)=>Math.round(z);
    
    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, fn, (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h));

    }else if(isTensor(a)){
        return ops.applyfn(a, fn);        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function neg<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    if(isVertex(a)){
                
        return multiply(
            a, 
            new Vertex(
                new Tensor(new Array(a.tensor_.data.length).fill(-1), a.tensor_.shape)
            )
        );        

    }else if(isTensor(a)){
        
        return ops.multiply(
            a, 
            new Tensor(new Array(a.data.length).fill(-1), a.shape)            
        );        

    }else{
        throw new Error("inputs should be same type");
    }
}


export function cos<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, 
            (z:number)=>Math.cos(z), 
            (z:number)=>-1*Math.sin(z)
        )

    }else if(isTensor(a)){
        return ops.applyfn(a, (z:number)=>Math.cos(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function sin<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, 
            (z:number)=>Math.sin(z), 
            (z:number)=>Math.cos(z)
        )

    }else if(isTensor(a)){
        return ops.applyfn(a, (z:number)=>Math.sin(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function tan<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, 
            (z:number)=>Math.tan(z), 
            (z:number)=>1/Math.cos(z)**2,
        )

    }else if(isTensor(a)){
        return ops.applyfn(a, (z:number)=>Math.tan(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function sqrt<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, 
            (z:number)=>Math.sqrt(z), 
            (z:number)=>0.5 * ( z**-0.5),
        )

    }else if(isTensor(a)){
        return ops.applyfn(a, (z:number)=>Math.sqrt(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function recp<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a)){
        
        let h = 0.05;
        return applyfn(a, 
            (z:number)=>1/z, 
            (z:number)=>(z**-2),
        )

    }else if(isTensor(a)){
        return ops.applyfn(a, (z:number)=>1/z);        
    }else{
        throw new Error("inputs should be same type");
    }

}



export function max<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a) && isVertex(b)){        
        
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

            a.grad_ = ops.add(a.grad_, new Tensor(a_grad_arr, res.grad_.shape));
            b.grad_ = ops.add(b.grad_, new Tensor(b_grad_arr, res.grad_.shape));
        }
                
        return res;

    }else if(isTensor(a) && isTensor(b)){
    
        return ops.max(a, b);
        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function min<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a) && isVertex(b)){        
        
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

            a.grad_ = ops.add(a.grad_, new Tensor(a_grad_arr, res.grad_.shape));
            b.grad_ = ops.add(b.grad_, new Tensor(b_grad_arr, res.grad_.shape));
        }
                
        return res;

    }else if(isTensor(a) && isTensor(b)){
    
        return ops.min(a, b);
        
    }else{
        throw new Error("inputs should be same type");
    }

}