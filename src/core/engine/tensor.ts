import * as wasm from "./wasm/ops";

import { current_backend } from './backend';
import { on_tensor } from "./memory";
import { input } from "./input";

export interface Tensor_interface{
    data:number[];
    shape:number[];
    print():boolean;
    destroy():void;
}

function find_shape<arr>(array:arr):number[]{    
    if(Array.isArray(array)){
        const _shape:number[] = [];
        _shape.push(array.length);
        find_shape(array[0]).forEach((v:number) => {
            _shape.push(v);
        });
        return _shape;
    }else{        
        return [];
    }
}

function extract(array:any):number[]{
    if(typeof(array) != "number"){
        let res:any[] = [];
    
        for (let a = 0; a < array.length; a++) {
            let el = array[a];
            extract(el).forEach(e => {
                res.push(e);
            });
        }

        return res;
    }else{
        return [array];
    }
} 

export class Tensor<m_arr> implements Tensor_interface{    

    private _data:number[];        
    private _shape:number[];

    public get data():number[]{
        return this._data;
    }
    public set data(d:number[]){
        this._data = d;
    }

    public get shape():number[]{
        return this._shape;
    }
    public set shape(d:number[]){
        this._shape = d;
    }

    constructor(array:m_arr, _shape?:number[]){       

        this._data = extract(array);
        this._shape = _shape ? Array.from(_shape) : find_shape(array);
        
        if(this._data.length != (this._shape.length == 0 ? 1 :this._shape.reduce((a, b)=>a*b))){
            throw new Error("given _shape is wrong")
        }

    }
    

    private build(
        _shape:number[] = this._shape, 
        _data:any = this._data
    ){            
        const res:any = []
        for (let s = 0; s < _shape[0]; s++) {
            res.push(
                _shape.length == 1 
                    ? _data[s] 
                    : this.build(
                        _shape.slice(1), 
                        _data.slice(s * Math.floor(_data.length/_shape[0]), s * Math.floor(_data.length/_shape[0]) + _shape.slice(1).reduce((a, b) => a*b))
                    )
            );
        }
        return res;
    }    


    print():boolean{            
        console.log(this.constructor.name)        
        if(this._shape.length == 0){
            console.log(JSON.stringify(this._data[0]));
            console.log(' ');
            return true;
        }
        let res:string = JSON.stringify(this.build());        
        let newstr:string = ''

        let count:number = 0;
        for(let cf:number = 0; cf < res.length; cf++){
            if(res[cf] == '['){
                count++;
            }else{
                break;
            }
        }
        for(let c:number = 0; c < res.length; c++){            
            if(res[c] == ',' && res[c + 1] == '['){
                let cn_count:number = 0;
                for(let cn:number = c+1; cn < res.length; cn++){
                    if(res[cn] != '[') break
                    cn_count += 1;
                }
                newstr += '\n'.repeat(cn_count) + ' '.repeat(count - cn_count);                                      
                continue;
            }            
            newstr += res[c] == ','? ' ' : res[c];
        }          
        console.log(newstr)
        console.log(' ');
        return true;
    }

    destroy(){
        this.data.forEach((d, i) => {
            delete this.data[i];
        });

        this.data = [];

        this.shape.forEach((s, i) => {
            delete this.shape[i];
        });

        this.shape = [];
    }
}

export class TensorView<m_arr> implements Tensor_interface{
    public Memory_address:number = 0;
    public isdestroyed:boolean = false;
    
    public get data():number[]{
        const dp = wasm.ops.get_data(this.Memory_address);
		const dl = wasm.ops.get_data_length(this.Memory_address);

		let arr = wasm.get_values(dp, dl, "HEAPF64");
		wasm.ops.destroy_array(dp);
        return arr;        
    }

    public set data(d:number[]){
		let mem = wasm.memory_allocator();				
		mem.allocate_array(d, "HEAPF64");		
		wasm.ops.set_data(this.Memory_address, mem.buffer, d.length);		
		mem.free();	
    }

    public get shape():number[]{
        const dp = wasm.ops.get_shape(this.Memory_address);
	    const dl = wasm.ops.get_shape_length(this.Memory_address);
	    let arr = wasm.get_values(dp, dl, "HEAPF64");
	    wasm.ops.destroy_array(dp);
	    return arr;
    }

    public set shape(d:number[]){
        let mem = wasm.memory_allocator();				
		mem.allocate_array(d, "HEAPF64");		
		wasm.ops.set_shape(this.Memory_address, mem.buffer, d.length);		
		mem.free();	
    }

    constructor(array:m_arr, shape?:number[], memory_adress?:number){
        this.Memory_address = 0;

        if(memory_adress){
            this.Memory_address = memory_adress;
        }else{
            this.Memory_address = wasm.ops.create_tensor();
            this.data = extract(array);
            this.shape = shape ? Array.from(shape) : find_shape(array);       
        }
        
        on_tensor.emit("created", this);
    }

    print(){ 
        wasm.ops.print(this.Memory_address, 0);
        return true 
    };

    destroy(){
        if(!this.isdestroyed){
            wasm.ops.destroy_tensor(this.Memory_address);
            this.isdestroyed = true;
        }
    };
}

/**
 * Creates a Tensor with the provided values and _shape.
 * @param values The values of the tensor. it can be n-dimensional array of numbers, or a TypedArray. 
 * @param _shape The _shape of the tensor. if it is not defined, it will be automatically found from values.
 */
export function tensor<m_arr>(values:m_arr, _shape?:number[]){    
    switch (current_backend) {
        default:
        case "CPU":
            return new Tensor(values, _shape);
           
        case "WASM":           
            return new TensorView(values, _shape);
    }    
}


export type Tensor_types<arr> = Tensor<arr> | TensorView<arr>;