import { types } from "@babel/core";

export class Tensor<m_arr>{
    public data:number[];
    public shape:number[];    

    constructor(array:m_arr, shape?:number[]){
        this.data = this.extract(array);
        this.shape = shape ? Array.from(shape) : this.findshape(array);
        
        if(this.data.length != (this.shape.length == 0 ? 1 :this.shape.reduce((a, b)=>a*b))){
            throw new Error("given shape is wrong")
        }
    }

    private findshape<arr>(array:arr):number[]{    
        if(Array.isArray(array)){
            const shape:number[] = [];
            shape.push(array.length);
            this.findshape(array[0]).forEach((v:number) => {
                shape.push(v);
            });
            return shape;
        }else{        
            return [];
        }
    }

    private extract(array:any):number[]{
        if(typeof(array) != "number"){
            let res:any[] = [];
            
            for (let a = 0; a < array.length; a++) {
                let el = array[a];
                this.extract(el).forEach(e => {
                    res.push(e);
                });
            }

            return res;
        }else{
            return [array];
        }
    }

    private build(
        shape:number[] = this.shape, 
        data:any = this.data
    ){            
        const res:any = []
        for (let s = 0; s < shape[0]; s++) {
            res.push(
                shape.length == 1 
                    ? data[s] 
                    : this.build(
                        shape.slice(1), 
                        data.slice(s * Math.floor(data.length/shape[0]), s * Math.floor(data.length/shape[0]) + shape.slice(1).reduce((a, b) => a*b))
                    )
            );
        }
        return res;
    }

    print():boolean{            
        console.log(this.constructor.name)        
        if(this.shape.length == 0){
            console.log(JSON.stringify(this.data[0]));
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
}

/**
 * Creates a Tensor with the provided values and shape.
 * @param values The values of the tensor. it can be n-dimensional array of numbers, or a TypedArray. 
 * @param shape The shape of the tensor. if it is not defined, it will be automatically found from values.
 */
export function tensor<m_arr>(values:m_arr, shape?:number[]){
    return new Tensor(values, shape)
}