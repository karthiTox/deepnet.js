export class nArray<m_arr>{    

    public data:number[] = [];        
    public index:number[] = [];        
    public shape:number[] = [];
    public is_sparse:boolean = false;

    constructor(array:m_arr, shape?:number[]|null, is_sparse:boolean = false){       
        this.is_sparse = is_sparse;

        // if sparse
        if(is_sparse){
            let extracted_data = extract(array);
    
            for (let d = 0; d < extracted_data.length; d++){
                if(extracted_data[d] != 0){
                    this.data.push(extracted_data[d]);
                    this.index.push(d);
                }            
            }            
        }
        
        // if dense
        else{
            this.data = extract(array);
        }

        this.shape = shape ? Array.from(shape) : find_shape(array);        

    } 

    get_data(i:number){
        return this.data[i];
    }

    get_index(i:number){
        if(this.is_sparse)
            return this.index[i];
        else
            return i;
    }

    print(){                    
        console.log(this.is_sparse ? "Sparse Array" : "Array");
        console.log(this.data);
        if(this.is_sparse) console.log(this.index);
        console.log(this.shape);        
    }
}


// --------------------- helper functions ---------------------
export function find_shape<arr>(array:arr):number[]{    
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

export function extract(array:any):number[]{
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