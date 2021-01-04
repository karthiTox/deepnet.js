import * as tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as vertex_ops from './cpu/vertex_ops/vertex_ops_entry';

import {Vertex} from "./Vertex";
import {Tensor, tensor} from "./tensor";
import { isTensor, isVertex } from './checks';
import { applyfn } from "./apply_fn";
import { multiply } from './basic';

export function floor<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    let fn = (z:number)=>Math.floor(z);
    if(isVertex(a)){
        let h = 0.05;
        let fn_ = (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h); 

        return vertex_ops.applyfn(a, fn, fn_);

    }else if(isTensor(a)){

        return tensor_ops.applyfn(a, fn);        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function ceil<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    let fn = (z:number)=>Math.ceil(z);
    
    if(isVertex(a)){
        
        let h = 0.05;
        let fn_ = (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h); 
               
        return vertex_ops.applyfn(a, fn, fn_);

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, fn);        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function round<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    let fn = (z:number)=>Math.round(z);
    
    if(isVertex(a)){
        
        let h = 0.05;
        let fn_ = (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h); 
               
        return vertex_ops.applyfn(a, fn, fn_);

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, fn);        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function neg<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{  
    if(isVertex(a)){                 
        
        return vertex_ops.multiply(
            a, 
            new Vertex ( tensor_ops.fill(a.tensor_.shape, -1) )
        ); 

    }else if(isTensor(a)){
        
        return tensor_ops.multiply(
            a, 
            new Tensor(new Array(a.data.length).fill(-1), a.shape)            
        );        

    }else{
        throw new Error("inputs should be same type");
    }
}


export function cos<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      
    let fn = (z:number)=>Math.cos(z);

    if(isVertex(a)){
        
        let fn_ = (z:number)=>-1*Math.sin(z);
        return vertex_ops.applyfn( a, fn, fn_ )

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, (z:number)=>Math.cos(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function sin<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      
    let fn = (z:number)=>Math.sin(z); 

    if(isVertex(a)){

        let fn_ = (z:number)=>Math.cos(z);   

        return vertex_ops.applyfn( a, fn, fn_ )

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, (z:number)=>Math.sin(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function tan<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      
    let fn = (z:number)=>Math.tan(z);

    if(isVertex(a)){
        
        let fn_ = (z:number)=>1/Math.cos(z)**2;
        return vertex_ops.applyfn( a, fn, fn_ )

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, (z:number)=>Math.tan(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function sqrt<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      
    let fn = (z:number)=>Math.sqrt(z);

    if(isVertex(a)){
        
        let fn_ = (z:number)=>0.5 * ( z**-0.5);                
        return vertex_ops.applyfn( a, fn, fn_ );

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, (z:number)=>Math.sqrt(z));        
    }else{
        throw new Error("inputs should be same type");
    }

}


export function recp<arr>(a:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      
    let fn = (z:number)=>1/z;

    if(isVertex(a)){
        
        let fn_ = (z:number)=>(z**-2);            
        return vertex_ops.applyfn( a, fn, fn_ );

    }else if(isTensor(a)){
        return tensor_ops.applyfn(a, (z:number)=>1/z);        
    }else{
        throw new Error("inputs should be same type");
    }

}



export function max<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a) && isVertex(b)){        
        
        return vertex_ops.max(a, b);       

    }else if(isTensor(a) && isTensor(b)){
    
        return tensor_ops.max(a, b);
        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function min<arr>(a:Vertex<arr>|Tensor<arr>, b:Vertex<arr>|Tensor<arr>):Vertex<arr>|Tensor<arr>{      

    if(isVertex(a) && isVertex(b)){        
        
        return vertex_ops.min(a, b);       

    }else if(isTensor(a) && isTensor(b)){
    
        return tensor_ops.min(a, b);
        
    }else{
        throw new Error("inputs should be same type");
    }

}