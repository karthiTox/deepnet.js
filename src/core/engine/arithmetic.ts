import * as cpu_tensor_ops from './cpu/tensor_ops/tensor_ops_entry';
import * as cpu_vertex_ops from './cpu/vertex_ops/vertex_ops_entry';

import * as wasm_tensor_ops from './wasm/tensor_ops/tensor_ops_entry';
import * as wasm_vertex_ops from './wasm/vertex_ops/vertex_ops_entry';

import * as act from "./util/activation"

import { current_backend } from './backend';

import { Vertex, Vertex_types } from "./Vertex";
import { Tensor, Tensor_types } from "./tensor";
import { isTensor, isTensorView, isVertex, isVertexView } from './checks';

import { input } from "./input"

import { debug_cpu, debug_wasm } from "./logger"

export function floor<arr>(a:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>Math.floor(z);
            if(isVertex(a)){
                let h = 0.05;
                let fn_ = (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h); 
        
                return cpu_vertex_ops.applyfn(a, fn, fn_);
        
            }else if(isTensor(a)){
        
                return cpu_tensor_ops.applyfn(a, fn);        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }

}

export function ceil<arr>(a:input<arr>):input<arr>{
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>Math.ceil(z);
            if(isVertex(a)){
                
                let h = 0.05;
                let fn_ = (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h); 
                       
                return cpu_vertex_ops.applyfn(a, fn, fn_);
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, fn);        
            }else{
                throw new Error("inputs should be same type");
            }
    
            
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }  

}


export function round<arr>(a:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>Math.round(z);
    
            if(isVertex(a)){
                
                let h = 0.05;
                let fn_ = (z:number)=>( fn(z + h) - fn(z - h) ) / (2*h); 
                       
                return cpu_vertex_ops.applyfn(a, fn, fn_);
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, fn);        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }

}


export function neg<arr>(a:input<arr>):input<arr>{ 
    switch (current_backend) {
        default:
        case "CPU":
            if(isVertex(a)){                 
        
                return cpu_vertex_ops.multiply(
                    a, 
                    new Vertex ( cpu_tensor_ops.fill(a.tensor_.shape, -1) )
                ); 
        
            }else if(isTensor(a)){
                
                return cpu_tensor_ops.multiply(
                    a, 
                    new Tensor(new Array(a.data.length).fill(-1), a.shape)            
                );        
        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }

}


export function cos<arr>(a:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>Math.cos(z);

            if(isVertex(a)){
                
                let fn_ = (z:number)=>-1*Math.sin(z);
                return cpu_vertex_ops.applyfn( a, fn, fn_ )
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, (z:number)=>Math.cos(z));        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }

  

}


export function sin<arr>(a:input<arr>):input<arr>{
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>Math.sin(z); 

            if(isVertex(a)){
        
                let fn_ = (z:number)=>Math.cos(z);   
        
                return cpu_vertex_ops.applyfn( a, fn, fn_ )
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, (z:number)=>Math.sin(z));        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }

    

}

export function tan<arr>(a:input<arr>):input<arr>{   
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>Math.tan(z);

            if(isVertex(a)){
                
                let fn_ = (z:number)=>1/Math.cos(z)**2;
                return cpu_vertex_ops.applyfn( a, fn, fn_ )
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, (z:number)=>Math.tan(z));        
            }else{
                throw new Error("inputs should be same type");
            }
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }

   

}


export function sqrt<arr>(a:input<arr>):input<arr>{ 
    switch (current_backend) {
        default:
            case "CPU":
            let fn = (z:number)=>Math.sqrt(z);
            
            if(isVertex(a)){
                        
                let fn_ = (z:number)=>0.5 * ( z**-0.5);                
                return cpu_vertex_ops.applyfn( a, fn, fn_ );
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, (z:number)=>Math.sqrt(z));        
            }else{
                throw new Error("inputs should be same type");
            }
   
            case "WASM":
                debug_wasm.log("added using wasm")
        
                if(isVertexView(a)){
                    return wasm_vertex_ops.applyfn(a, 4);
                }else if(isTensorView(a)){
                    return wasm_tensor_ops.applyfn(a, 4);        
                }else{
                    throw new Error("inputs should be same type");
                }
            }

    

}


export function recp<arr>(a:input<arr>):input<arr>{  
    switch (current_backend) {
        default:
        case "CPU":
            let fn = (z:number)=>1/z;
        
            if(isVertex(a)){
                
                let fn_ = (z:number)=>(z**-2);            
                return cpu_vertex_ops.applyfn( a, fn, fn_ );
        
            }else if(isTensor(a)){
                return cpu_tensor_ops.applyfn(a, (z:number)=>1/z);        
            }else{
                throw new Error("inputs should be same type");
            }
            
    
        case "WASM":
            debug_wasm.log("added using wasm")
    
            if(isVertexView(a)){
                return wasm_vertex_ops.applyfn(a, 4);
            }else if(isTensorView(a)){
                return wasm_tensor_ops.applyfn(a, 4);        
            }else{
                throw new Error("inputs should be same type");
            }
    }


}



export function max<arr>(a:input<arr>, b:input<arr>):input<arr>{      

    if(isVertex(a) && isVertex(b)){        
        
        return cpu_vertex_ops.max(a, b);       

    }else if(isTensor(a) && isTensor(b)){
    
        return cpu_tensor_ops.max(a, b);
        
    }else{
        throw new Error("inputs should be same type");
    }

}

export function min<arr>(a:input<arr>, b:input<arr>):input<arr>{      

    if(isVertex(a) && isVertex(b)){        
        
        return cpu_vertex_ops.min(a, b);       

    }else if(isTensor(a) && isTensor(b)){
    
        return cpu_tensor_ops.min(a, b);
        
    }else{
        throw new Error("inputs should be same type");
    }

}