import { nArray } from "./array";


export class util {
        
    static cal_step(shape:number[]) {		    
        let pos = 0;
        let res = [];

        for (let s = 0; s < shape.length; s++) {
            if (s == shape.length - 1){
                res[pos] = 1;
                pos++;
            }
            else {
                let tot = 1;
                for (let l = s + 1; l < shape.length; l++) {
                    tot *= shape[l];
                };
                res[pos] = tot;
                pos++;
            }
        }	
        
        return res;
    };
    
    static cal_index(index:number[], step:number[]) {
        let res = 0;
        for (let i = 0; i < index.length; i++) {
            res += index[i] * step[i];
        };
        return res;
    }
    
    static copy_to(from:number[], to:number[]){
        for (let i = 0; i < from.length; i++)
        {
            to[i] = from[i];
        }                    
    }

    static cal_step_change(step:number[], dimension:number[]) {
        let res = [];
        for (let d = 0; d < step.length; d++) {
            res[d] = step[dimension[d]];
        }; 
        return res;         
    }        
  
    static find_index(shape:number[], step:number[], index:number) {            
        let res = []
        for (let s = 0; s < shape.length; s++) {
            res[s] = shape[s] * step[s];
            res[s] = Math.floor((index % res[s]) / step[s]);
        }   
        return res;         
    }

};


export enum Basic_types{
    add,
    sub,
    mul,
    div
};

export class ops
{       
    static basic_types = Basic_types;

    private static basic_op (a:number , b:number, op_type:Basic_types) {
        switch (op_type)
        {
        default:
        case Basic_types.add: return (a + b);                                
        case Basic_types.sub: return (a - b);                                
        case Basic_types.mul: return (a * b);                                
        case Basic_types.div: return (a / b);                                        
        };
    }
       
    static match_dim(s1:number[], s2:number[]){                               
        let larger = Array.from(s1);
        let smaller = Array.from(s2);        
        if(s1.length < s2.length) {
            larger = s2;
            smaller = s1;
        }

        for (let s = 0; s < smaller.length; s++) {
            if (larger[s] != smaller[s]) {
                if (larger[s] != 1 && smaller[s] != 1) {
                    throw new Error(`can't broadcast ${larger} and ${smaller}`);
                }
            };
            
        }

        let fill_count = larger.length - smaller.length;
        for (let i = 0; i < fill_count; i++) {
            smaller.unshift(1);            
        }

        return [larger, smaller];        
    }

    
    static broadcast_dim(a1:number[], a2:number[]){                               
        let s1 = Array.from(a1);
        let s2 = Array.from(a2);          

        for (let s = 0; s < s2.length - 2; s++) {
            if (s1[s] != s2[s]) {
                if (s1[s] != 1 && s2[s] != 1) {
                    throw new Error(`can't broadcast ${s1} and ${s2}`);
                }
            };            
        }    
              
        let len = s1.length - s2.length;
        for (let s = 0; s < len; s++) {
            s2.unshift(1);          
        }        

        let res = [];
        for (let s = 0; s < s1.length; s++) {
            res.push(Math.max(s1[s], s2[s]));
        }                

        return [s1, s2, res];
    }

    static basic <arr>( a:nArray<arr>, b:nArray<arr>, result:nArray<arr>, op_type:Basic_types = Basic_types.add ) {
        if (a.shape.reduce((n1, n2) => n1 * n2) > b.shape.reduce((n1, n2) => n1 * n2)) {            
            return this.basic_main(a, b, result, op_type);
        } else {
            return this.basic_main(b, a, result, op_type);
        }        
    }
    
    protected static basic_main<arr>( a:nArray<arr>, b:nArray<arr>, result:nArray<arr>, op_type:Basic_types){                        
        let [a_shape, b_shape, res_shape] = this.broadcast_dim(a.shape, b.shape);       
        let [a_step, b_step, res_step] = [a_shape, b_shape, res_shape].map(v => util.cal_step(v));
        let size = res_shape.reduce((a, b) => a*b);


        if(a.is_sparse == true || b.is_sparse == true)
        {               
            let apos = 0, bpos = 0, rpos = 0;
            let li = -1;

            while(apos < a.data.length)
            {          
                bpos %= b.data.length;                
                let aindex = util.find_index(res_shape, res_step, a.get_index(apos))
                let bindex = util.find_index(res_shape, res_step, b.get_index(bpos))
                let rindex = aindex.map((a, b) => Math.max(a, bindex[b]))
                
                aindex = aindex.map((v,i) => v%b_shape[i]);
                bindex = bindex.map((v,i) => v%a_shape[i]);

                let ai = util.cal_index(aindex, b_step);
                let bi = util.cal_index(bindex, a_step);
                let ri = util.cal_index(rindex, res_step);                           
                
                if(ai < bi)
                {  
                    apos++;
                }
                else if(ai > bi)
                {    
                    bpos++;                   
                }
                else
                {
                    if (li+1 < ri) {
                        for (let i = li+1; i < ri; i++) {                            
                            let i_in_res = util.find_index(res_shape, res_step, i);
                            let i_in_b = util.cal_index(i_in_res.map((v, i) => v%b_shape[i]), b_step);
                            result.data[rpos] = b.data[i_in_b];
                            result.index[rpos] = i;                            
                            rpos++;
                        }
                    }
                    
                    result.data[rpos] = this.basic_op( a.data[apos], b.data[bpos], op_type );
                    result.index[rpos] = ri;                    
                    li = ri;

                    rpos++;                
                    apos++;
                    bpos++;
                }

            }        

            if (li < size) {
                for (let i = li+1; i < size; i++) {                            
                    let i_in_res = util.find_index(res_shape, res_step, i);
                    let i_in_b = util.cal_index(i_in_res.map((v, i) => v%b_shape[i]), b_step);
                    result.data[rpos] = b.data[i_in_b];
                    result.index[rpos] = i;                            
                    rpos++;
                }
            }

            return result;
        }
        if(true)
        {                                     

            let is_equal = true;
            if(a.shape.length = b.shape.length)
                for (let i = 0; i < b.shape.length; i++) 
                    if(a.shape[i] != b.shape[i]) {
                        is_equal = false; break;
                    }

            if (is_equal) {
                for (let d = 0; d < a.data.length; d++)
                {
                    result.data[d] = this.basic_op(a.data[d], b.data[d], op_type)
                }
            } else{

                for (let d = 0; d < size; d++)
                {
                    let res_index = util.find_index(res_shape, a_step, d)
                    let aindex = res_index.map((r,i) => r%a_shape[i]);
                    let bindex = res_index.map((r,i) => r%b_shape[i]);
                    let ai = util.cal_index(aindex, a_step);
                    let bi = util.cal_index(bindex, b_step);
                    
                    result.data[d] = this.basic_op( a.data[ai], b.data[bi], op_type );
                };

            }
            
            
            return result;
        }                       
        
    }
    
    static unbroadcast<arr>(a:nArray<arr>, original_shape:number[]){ 
        let [a_shape, o_shape] = this.match_dim(a.shape, original_shape);
        let [a_step, o_step] = [util.cal_step(a.shape), util.cal_step(o_shape)];
        
        let res = new Array(original_shape.reduce((a, b)=>a*b)).fill(0);
        
        a.data.forEach((d, i) => {
            let a_index = util.find_index(a.shape, a_step, i);
            let o_index:number[] = [];
            a_index.forEach((ai, i) => {
                o_index[i] = ai % o_shape[i];
            });

            let o = util.cal_index(o_index, o_step);
            res[o] += d; 
        })

        return new nArray(res, original_shape, a.is_sparse);
    }
    
    
    static reduce_sum<arr>(a:nArray<arr>, axis:number){
        const a_splited = this.split_till(a.data, a.shape, axis);
        let res = new Array(a_splited[0].length).fill(0);
        for (let i = 0; i < a_splited.length; i++) {
            a_splited[i].forEach((v, i) => {
                res[i] += v;
            })
        }        

        return new nArray(res, a.shape.slice(axis), a.is_sparse);
    }


    static split_till(val:number[], shape:number[], axis:number){
        
        let a_shape = shape.slice(axis);

        let tot_el = a_shape.length != 0 ? a_shape.reduce((a, b) => a * b) : 1;

        const res = [];
        for (let i = 0; i < val.length / tot_el; i++) {           
            res.push(
                val.slice(i * tot_el, i * tot_el + tot_el)
            )                                
        }
        return res;
    }



    static transpose<arr> (a:nArray<arr>, res:nArray<arr>, dimension:number[]) {

        let step = util.cal_step(a.shape);
        let tshape = util.cal_step_change(a.shape, dimension);
        let tstep = util.cal_step(tshape);

        res.shape = Array.from(tshape);
        
        for (let i = 0; i < a.data.length; i++)
        {
            let index = util.find_index(a.shape, step, a.is_sparse ? a.index[i] : i);            
            let new_index = util.cal_index(util.cal_step_change(index, dimension), tstep);

            if (a.is_sparse == false)
            {
                res.data[new_index] = a.data[i];
            }
            else
            {

                let j = i;
                res.index[j] = new_index;
                res.data[j] = a.data[j];

                while (res.index[j - 1] > res.index[j] && j > 0)
                {
                    // swaping index
                    let t;
                    t = res.index[j];
                    res.index[j] = res.index[j - 1];
                    res.index[j - 1] = t;
                    
                    // swaping data
                    t = res.data[j];
                    res.data[j] = res.data[j - 1];
                    res.data[j - 1] = t;
                    
                    j--;
                }

            }
        }

        return res;  
    };


    
    static strassen(a:number[], b:number[])
    {

        let m1, m2, m3, m4, m5, m6, m7;
        
        let a0 = a[0];
        let a1 = a[1];
        let a2 = a[2];
        let a3 = a[3];

        let b0 = b[0];
        let b1 = b[1];
        let b2 = b[2];
        let b3 = b[3];

        m1 = (a0 + a3) * (b0 + b3);
        m2 = (a2 + a3) * b0;

        m3 = a0 * (b1 - b3);
        m4 = a3 * (b2 - b0);

        m5 = (a0 + a1) * b3;
        m6 = (a2 - a0) * (b0 + b1);
        m7 = (a1 - a3) * (b2 + b3);

        let res:number[] = [];
        
        res[0] = m1 + m4 - m5 + m7;
        res[1] = m3 + m5;
        res[2] = m2 + m4;
        res[3] = m1 - m2 + m3 + m6;

        return res;

    };

    
    static broadcast_matmul_dim(a1:number[], a2:number[]){                               
        let s1 = Array.from(a1);
        let s2 = Array.from(a2); 
        
        let is_swaped = false;
        if(a1.reduce((a, b) => a * b) < a2.reduce((a, b) => a * b)) {
            is_swaped = true;
            let t = s1;
            s1 = s2;
            s2 = t;
        }

        for (let s = 0; s < s2.length - 2; s++) {
            if (s1[s] != s2[s]) {
                if (s1[s] != 1 && s2[s] != 1) {
                    throw new Error(`can't broadcast ${s1} and ${s2}`);
                }
            };            
        }

        if (a1[a1.length - 1] != a2[a2.length - 2]) {
            throw new Error(`shape1: ${s1} , shape2: ${s2}, {m, k} x {k, n} = {m, n} => k value should match`);
        };        
              
        let len = s1.length - s2.length;
        for (let s = 0; s < len; s++) {
            s2.unshift(1);          
        }        

        let res = [];
        for (let s = 0; s < s1.length - 2; s++) {
            res.push(Math.max(s1[s], s2[s]));
        }        
        res.push(a1[a1.length - 2], a2[a2.length - 1]);

        return is_swaped ? [s2, s1, res] : [s1, s2, res];
    }

    protected static broadcast_down(
        broadcasted_shape:number[], 
        broadcasted_step:number[], 
        real_shape:number[], 
        real_step:number[], i:number
    ) 
    {
        let index = util.find_index(broadcasted_shape, broadcasted_step, i);
        index = index.map((v, i)=> v%real_shape[i]);
        
        return util.cal_index(index, real_step);
    }

    static matmul<arr> (a:nArray<arr>, b:nArray<arr>, res:nArray<arr>) {                      
       
        // half broadcasted shape & step
        let [a_shape, b_shape, res_shape] = this.broadcast_matmul_dim(a.shape, b.shape);                
        let [a_step, b_step, res_step] = [a_shape, b_shape, res_shape].map(v => util.cal_step(v));                
        
        // fully broadcasted shape & step
        let [n_a_shape, n_b_shape, n_res_shape] = [Array.from(res_shape), Array.from(res_shape), Array.from(res_shape)];                
        n_a_shape[n_a_shape.length - 1] = a_shape[n_a_shape.length - 1];
        n_a_shape[n_a_shape.length - 2] = a_shape[n_a_shape.length - 2];

        n_b_shape[n_a_shape.length - 1] = b_shape[n_a_shape.length - 1];
        n_b_shape[n_a_shape.length - 2] = b_shape[n_a_shape.length - 2];

        let [n_a_step, n_b_step, n_res_step] = [n_a_shape, n_b_shape, n_res_shape].map(v => util.cal_step(v));                

        // size and step of a, b & res of fully broadcasted shape & step
        let size = n_res_shape.reduce((a, b) => a * b);    
        let count = size / (n_res_shape[n_res_shape.length - 2] * n_res_shape[n_res_shape.length - 1]);        
        let a_split_size = (n_a_shape[n_a_shape.length - 2] * n_a_shape[n_a_shape.length - 1]);
        let b_split_size = (n_b_shape[n_b_shape.length - 2] * n_b_shape[n_b_shape.length - 1]);
        let res_split_size = (n_res_shape[n_res_shape.length - 2] * n_res_shape[n_res_shape.length - 1]);   
        
        // converting fully broadcasted shape & step to half
        let get_down_a = (i:number) => this.broadcast_down(n_a_shape, n_a_step, a_shape, a_step, i);        
        let get_down_b = (i:number) => this.broadcast_down(n_b_shape, n_b_step, b_shape, b_step, i);

        if (a.is_sparse == true || b.is_sparse == true)
        {            
            res.data.length = 0;
            res.index.length = 0;
                                            
            let apos = 0, bpos = 0;
            let astep_id = 0, bstep_id = 0;
            
            for (apos = 0; apos < a.data.length; apos++)
            {                
                let n_a_index = util.find_index(n_a_shape, n_a_step, a.get_index(apos));                
                astep_id = Math.floor( get_down_b( a.get_index(apos) ) / b_split_size );

                for (bpos = 0; bpos < b.data.length; bpos++)
                {
                    bstep_id = Math.floor( get_down_a( b.get_index(bpos) ) / a_split_size);                    

                    let n_b_index = util.find_index(n_b_shape, n_b_step, b.get_index(bpos));
                    let n_res_index = n_a_index.map((na, i) => Math.max(na, n_b_index[i]));
                    n_res_index[n_res_index.length - 2] = n_a_index[n_b_index.length - 2];
                    n_res_index[n_res_index.length - 1] = n_b_index[n_b_index.length - 1];
                                       
                    if (n_a_index[n_b_index.length - 1] == n_b_index[n_b_index.length - 2]) {
                        
                        if(astep_id == bstep_id) {                                                        

                            let rpos = util.cal_index(n_res_index, n_res_step);                            
                            
                            if(res.index.length == 0) {
                                res.data.push(a.data[apos] * b.data[bpos]);
                                res.index.push(rpos);
                            } else {
                                let is_exist = false;
                                for (let r = res.index.length - 1; r >= 0; r--) {
                                    if(res.index[r] == rpos) {                                        
                                        res.data[r] += a.data[apos] * b.data[bpos];
                                        is_exist = true;
                                    }                                    
                                }                       
                                
                                if(!is_exist) {
                                    res.data.push(a.data[apos] * b.data[bpos]);
                                    res.index.push(rpos)
                                }
                            }
                        }
                    }
                }

            }

            return res;
        }
        else
        {   
            // broadcast is supported                                 
            
            // ref to last two indices
            let fi = res_shape.length - 2;
            let si = res_shape.length - 1;
    
            // matmul
            for (let s = 0; s < count; s++)
            {
                for (let i = 0; i < n_a_shape[fi]; i += 2)
                {
                    for (let j = 0; j < n_a_shape[si]; j += 2)
                    {
                        for (let k = 0; k < n_b_shape[si]; k += 2)
                        {
    
                            let stra_res = this.strassen(
                                [
                                    i < n_a_shape[fi] && j < n_a_shape[si] ? a.data[ get_down_a( (s * a_split_size) + i * n_a_step[fi] + j * n_a_step[si]) ] : 0,
                                    i < n_a_shape[fi] && j+1 < n_a_shape[si] ? a.data[ get_down_a( (s * a_split_size) + i * n_a_step[fi] + (j + 1) * n_a_step[si]) ]  : 0,
                                    i+1 < n_a_shape[fi] && j < n_a_shape[si] ? a.data[ get_down_a( (s * a_split_size) + (i + 1) * n_a_step[fi] + j * n_a_step[si]) ]  : 0,
                                    i+1 < n_a_shape[fi] && j+1 < n_a_shape[si] ? a.data[ get_down_a( (s * a_split_size) + (i + 1) * n_a_step[fi] + (j + 1) * n_a_step[si]) ]  : 0
                                ],                         
                                [
                                    j < n_b_shape[fi] && k < n_b_shape[si] ? b.data[ get_down_b( (s * b_split_size) + j * n_b_step[fi] + k * n_b_step[si]) ] : 0,
                                    j < n_b_shape[fi] && k+1 < n_b_shape[si] ? b.data[ get_down_b( (s * b_split_size) + j * n_b_step[fi] + (k + 1) * n_b_step[si]) ] : 0,
                                    j+1 < n_b_shape[fi] && k < n_b_shape[si] ? b.data[ get_down_b( (s * b_split_size) + (j + 1) * n_b_step[fi] + k * n_b_step[si]) ] : 0,
                                    j+1 < n_b_shape[fi] && k+1 < n_b_shape[si] ? b.data[ get_down_b( (s * b_split_size) + (j + 1) * n_b_step[fi] + (k + 1) * n_b_step[si]) ] : 0
                                ]
                            );
                                
                            let pos;
                            if (i < n_res_shape[fi] && k < n_res_shape[si]) {
                                pos = (s * res_split_size) + i * n_res_step[fi] + k * n_res_step[si];
                                res.data[pos] ? res.data[pos] += stra_res[0] : res.data[pos] = stra_res[0];
                            }                    

                            if (i < n_res_shape[fi] && k+1 < n_res_shape[si]) {
                                pos = (s * res_split_size) + i * n_res_step[fi] + (k + 1) * n_res_step[si];
                                res.data[pos] ? res.data[pos] += stra_res[0] : res.data[pos] = stra_res[1];
                            }

                            if (i+1 < n_res_shape[fi] && k < n_res_shape[si]) {
                                pos = (s * res_split_size) + (i + 1) * n_res_step[fi] + k * n_res_step[si];
                                res.data[pos] ? res.data[pos] += stra_res[0] : res.data[pos] = stra_res[2];
                            }

                            if (i+1 < n_res_shape[fi] && k+1 < n_res_shape[si]) {
                                pos = (s * res_split_size) + (i + 1) * n_res_step[fi] + (k + 1) * n_res_step[si];
                                res.data[pos] ? res.data[pos] += stra_res[0] : res.data[pos] = stra_res[3];
                            }

                        }
                    }
                }
            }
    
            res.data.length = size;
            res.shape = n_res_shape;
            return res;
        }    
    }

    static applyfn<arr> (a:nArray<arr>, res:nArray<arr>,fn:(...a:number[])=>number) {
        for (let d = 0; d < a.data.length; d++) {
            res.data[d] = fn(a.data[d]);
            if (res.is_sparse) if (a.index[d]) res.index[d] = a.index[d];                 
        }        
        return res;
    }

};   


// console.time("start")
// let r = new nArray(new Array(2).fill(0), [2, 2], true)
// ops.matmul(    
//     new nArray([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12], [3, 1, 1, 2, 2, 1], true),
//     new nArray([1, 2], [1, 2], true),
//     r,    
// )
// r.print();
// console.timeEnd("start")


// console.time("start")
// let a = new nArray([1, 2], [2, 1], false);
// let b = new nArray([1, 1], [1, 2], false);
// let r = new nArray([], [2, 2], true)
// ops.matmul(    
//     a,
//     b,
//     r,    
// )
// r.print();
// console.timeEnd("start")

// console.log(ops.broadcast_dim([3, 1, 2, 2, 2, 1], [3, 2, 1, 2, 1, 2]));

// Array
// [
//   2, 4,  6,  8,
//   6, 8, 10, 12
// ]
// [ 2, 2, 2, 2, 2 ]



// from
// [[[1 2]]

//  [[3 4]]]

// to
// [[[1, 2],
//   [1, 2]],

//  [[3, 4],
//   [3, 4]]]