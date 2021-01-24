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

    print() {
        // reconstructing the data
        let data = [];
        if(!this.is_sparse){
            data = this.data;
        } else {
            let tot = this.shape.reduce((a, b) => a * b);
            let cur = 0;
            for (let d = 0; d < this.index.length; d++) {
                if (cur == this.index[d]) {
                    data[cur] = this.data[d];
                    cur++;
                } else {
                    let missing = this.index[d] - cur;

                    for (let m = 0; m < missing; m++) {                        
                        data.push(0);
                    }

                    data.push(this.data[d]);
                    cur = this.index[d];
                    cur++;
                }
            }

            
            let last_missing = tot - data.length;
            for (let i = 0; i < last_missing; i++) {
                data.push(0);                               
            }
        }

        let ns = "";
    
        let t_el = [];
    
        for (let i = 0; i < this.shape.length; i++){
            let t = 1;
            for (let j = i; j < this.shape.length; j++) {
                t *= this.shape[j];
            }
            t_el.push(t);
        }
    
        for (let i = 0; i < this.shape.length; i++) {
            ns += "[";
        }
    
        let i = 0;
        let count = 0;
        for (let di = 0; di < data.length; di++) {
            let d = data[di];

            for (const s of t_el) {
                if(i%s == 0){
                    count++;
                }
            }
    
            if (i != 0) {
                if (count > 0) {
                    ns = ns.substring(0, ns.length - 1);
                    for (let i = 0; i < count; i++) {
                        ns += "]";
                    }
                    ns += ",";
                    for (let i = 0; i < count; i++) {
                        ns += "[";
                    }
                }
            }
    
            ns += d;
            ns += ",";
    
            i++;
            count = 0;
        }
    
        ns = ns.substring(0, ns.length - 1);
        for (let i = 0; i < this.shape.length; i++) {
            ns += "]";
        };
    
        this.print_tensor(ns, this.shape.length);
    };
    
    
    private print_tensor(res:string, count:number){
        let str = res;
        console.log(`${this.is_sparse?'Sparse ':''}Tensor`);
    
        let to_print = "";

        for (let c = 0; c < str.length; c++) {		
            if (str[c] == ',' && str[c + 1] == '[') {
                let cn_count = 0;
    
                for (let cn = c + 1; cn < str.length; cn++) {
                    if (str[cn] != '[') break;
                    cn_count += 1;
                }
    
                for (let i = 0; i < cn_count; i++){
                    to_print += "\n";
                }
    
                for (let i = 0; i < (count - cn_count); i++){
                    to_print += " ";
                }
    
                continue;
            }
    
            else if (str[c] == ',') {
                to_print += " ";
            }
            else {
                to_print += str[c];
            }
        }
        
        console.log(to_print + "\n")        

    
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
