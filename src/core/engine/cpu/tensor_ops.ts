import { nArray } from "./Array";
import { ops, util } from "./array_ops";
import * as rand_gen from "../util/random";

export class Tensor<m_arr>{
    public value:nArray<m_arr>;
    public grad:nArray<m_arr>;
    public parents:[Tensor<m_arr>|null, Tensor<m_arr>|null];
    public feed(){};
    public back(){};

    constructor(array:m_arr, shape?:number[]|null, is_sparse:boolean = false){
        this.value = new nArray(array, shape, is_sparse);
        this.grad = new nArray(new Array(this.value.data.length).fill(0), shape, is_sparse);
        this.parents = [null, null];
    } 

    public print() {
        this.value.print();
    }
}


export class ops_cpu{
    public Tensor_type = Tensor;

    tensor<arr>(array:arr, shape?:number[]|null, is_sparse:boolean = false){
        return new Tensor(array, shape, is_sparse);
    }

    private find_tot (shape:number[]):number {
        let tot = shape.reduce((a, b)=> a * b);
        return tot;
    }

    randn(shape:number[], is_sparse:boolean = false){
        let tot = this.find_tot(shape);
        let res = [];
        for (let r = 0; r < tot; r++) {            
            res.push(rand_gen.randn(0, 0.4));            
        }
        return this.tensor(res, shape, is_sparse);
    }

    ones(shape:number[], is_sparse:boolean = false) {
        let tot = this.find_tot(shape);
        return this.tensor(new Array(tot).fill(1), shape, is_sparse);
    }

    zeros(shape:number[], is_sparse:boolean = false) {
        if(!is_sparse) {
            let tot = this.find_tot(shape);
            return this.tensor(new Array(tot).fill(0), shape, is_sparse);
        }else {
            return this.tensor([], shape, is_sparse);
        }
    }
    
    fill(shape:number[], value:number, is_sparse:boolean = false) {
        let tot = this.find_tot(shape);
        return this.tensor(new Array(tot).fill(value), shape, is_sparse);
    }

    add<arr>(a:Tensor<arr>, b:Tensor<arr>){
        let res = new Tensor(new Array(a.value.data.length).fill(0), a.value.shape, a.value.is_sparse);
        
        res.parents = [a, b];

        res.feed = ()=>{
            for (let v = 0; v < res.value.data.length; v++) {
                res.value.data[v] = 0;                
            };

            ops.basic(a.value, b.value, res.value, ops.basic_types.add);
        }
  
        res.feed();
  
        res.back = ()=>{
            let grada = ops.unbroadcast(res.grad, a.value.shape);
            let gradb = ops.unbroadcast(res.grad, b.value.shape);

            ops.basic(grada, a.grad, a.grad, ops.basic_types.add);
            ops.basic(gradb, b.grad, b.grad, ops.basic_types.add);
        }
  
        return res;
    }

    sub<arr>(a:Tensor<arr>, b:Tensor<arr>){
        let res = new Tensor(new Array(a.value.data.length).fill(0), a.value.shape, a.value.is_sparse);
        
        res.parents = [a, b];

        res.feed = ()=>{
            for (let v = 0; v < res.value.data.length; v++) {
                res.value.data[v] = 0;                
            };
            ops.basic(a.value, b.value, res.value, ops.basic_types.sub);
        }
  
        res.feed();
  
        res.back = ()=>{
            let grada = ops.unbroadcast(res.grad, a.value.shape);
            let gradb = ops.unbroadcast(res.grad, b.value.shape);

            ops.basic(grada, a.grad, a.grad, ops.basic_types.add);
            ops.basic(gradb, b.grad, b.grad, ops.basic_types.add);
            b.grad.data.map(v => v*-1);
        }
  
        return res;
    }

    mul<arr>(a:Tensor<arr>, b:Tensor<arr>){
        let res = new Tensor(new Array(a.value.data.length).fill(0), a.value.shape, a.value.is_sparse);
        
        res.parents = [a, b];

        res.feed = ()=>{
            for (let v = 0; v < res.value.data.length; v++) {
                res.value.data[v] = 0;                
            };
            ops.basic(a.value, b.value, res.value, ops.basic_types.mul);
        }
  
        res.feed();
  
        res.back = ()=>{
            let gradA = ops.unbroadcast(res.grad, a.value.shape);
            let gradB = ops.unbroadcast(res.grad, b.value.shape);

            let gradb = new nArray(new Array(a.grad.data.length).fill(0), a.grad.shape, a.grad.is_sparse);
            ops.basic(gradA, a.value, gradb, ops.basic_types.mul);
            ops.basic(gradb, b.grad, b.grad, ops.basic_types.add);
            
            let grada = new nArray(new Array(a.grad.data.length).fill(0), a.grad.shape, a.grad.is_sparse);
            ops.basic(gradB, b.value, grada, ops.basic_types.mul);
            ops.basic(grada, a.grad, a.grad, ops.basic_types.add);
        }
  
        return res;
    }

    div<arr> (a:Tensor<arr>, b:Tensor<arr>) {        
        let bi = this.recp(b);
        return this.mul(a, bi);
    }

    transpose<arr> (a:Tensor<arr>, dimension?:number[]) {
        let dim = dimension ? dimension : a.value.shape.map((v, i)=>a.value.shape.length-1-i);
        
        let res = new Tensor(new Array(a.value.data.length).fill(0), util.cal_step_change(a.value.shape, dim), a.value.is_sparse);
        
        res.parents = [a, null];

        res.feed = ()=>{
            for (let v = 0; v < res.value.data.length; v++) {
                res.value.data[v] = 0;                
            };

            ops.transpose(a.value, res.value, dim);
        }
  
        res.feed();
  
        res.back = ()=>{
            let grad = new nArray(new Array(a.grad.data.length).fill(0), a.grad.shape, a.grad.is_sparse);
            ops.transpose(res.grad, grad, dim);

            ops.basic(grad, a.grad, a.grad, ops.basic_types.add);
        }
  
        return res;
    }

    matmul<arr> (a:Tensor<arr>, b:Tensor<arr>) {
        let res_size = 1;
        let res_shape = [];
        for (let i = 0; i < a.value.shape.length - 1; i++) {
            res_size *= a.value.shape[i];            
            res_shape[i] = a.value.shape[i];
        }
        res_size *= b.value.shape[b.value.shape.length - 1];
        res_shape[b.value.shape.length - 1] = b.value.shape[b.value.shape.length - 1];

        let res = new Tensor(new Array(res_size).fill(0), res_shape, a.value.is_sparse);
        res.parents = [a, b];

        res.feed = ()=>{
            for (let v = 0; v < res.value.data.length; v++) {
                res.value.data[v] = 0;                
            };

            ops.matmul(a.value, b.value, res.value);
            res.grad.shape = Array.from(res.value.shape);
        };

        res.feed();

        res.back = ()=>{
            let at = new nArray(new Array(a.value.data.length).fill(0), a.value.shape, a.value.is_sparse);
            let bt = new nArray(new Array(b.value.data.length).fill(0), b.value.shape, b.value.is_sparse);
            let grada = new nArray(new Array(a.grad.data.length).fill(0), a.grad.shape, a.grad.is_sparse);
            let gradb = new nArray(new Array(b.grad.data.length).fill(0), b.grad.shape, b.grad.is_sparse);
            
            let dima = a.grad.shape.map((v, i)=>i);
            let t = dima[dima.length - 1];
            dima[dima.length - 1] = dima[dima.length - 2];        
            dima[dima.length - 2] = t;

            ops.transpose(a.value, at, dima);

            let dimb = b.grad.shape.map((v, i)=>i);
            t = dimb[dimb.length - 1];
            dimb[dimb.length - 1] = dimb[dimb.length - 2];        
            dimb[dimb.length - 2] = t;
            
            ops.transpose(b.value, bt, dimb);            

            ops.matmul(res.grad, bt, grada);
            ops.matmul(at, res.grad, gradb);
            
            let gradA = ops.unbroadcast(grada, a.grad.shape);
            let gradB = ops.unbroadcast(gradb, b.grad.shape);

            ops.basic(gradA, a.grad, a.grad, ops.basic_types.add);
            ops.basic(gradB, b.grad, b.grad, ops.basic_types.add);
        };

        return res;
    };

    get_output<arr>(s:Tensor<arr>|null) {               
        if(!s) return;

        for (let p = 0; p < s.parents.length; p++) {
            this.get_output(s.parents[p]);
        }

        s.feed();

        return s;
    }

    grad_zero<arr>(s:Tensor<arr>|null) {               
        if(!s) return;

        s.grad.data = s.grad.data.map(v => 0);

        for (let p = 0; p < s.parents.length; p++) {
            this.grad_zero(s.parents[p]);
        }
    }

    private backpass_main<arr>(s:Tensor<arr>|null) {        
        if(!s) return;
        
        s.back();        

        for (let p = 0; p < s.parents.length; p++) {
            this.backpass_main(s.parents[p]);
        }
    }

    backpass<arr>(s:Tensor<arr>, res?:Tensor<arr>) {
        if(res) {
            s.grad.data = res.value.data;            
        }else{
            s.grad.data = s.grad.data.map(v=>1);        
        }

        this.backpass_main(s);
    }    

    sig<arr>(a:Tensor<arr>) {                
        return this.applyfn(
            a,
            (z:number)=>{
                return 1.0 / (1.0 + Math.exp(-1 * z));
            },
            (z:number)=>{
                return (1.0 / (1.0 + Math.exp(-1 * z))) * (1 - (1.0 / (1.0 + Math.exp(-1 * z))));
            },            
        );
    }

     
    relu<arr>(a:Tensor<arr>) {        
        return this.applyfn(
            a, 
            (z:number)=>{
                if (0 > z) {
                    return 0;
                }
                else if (0 < z) {
                    return z;
                }
                else {
                    return z;
                }
            },

            (z:number)=>{
                if (z > 0) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        );
    }
     
    tanh<arr>(a:Tensor<arr>) {        
        return this.applyfn(
            a, 

            (z:number)=>{
                return (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z));
            },

            (z:number)=>{
                return 1 - ((Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z)) * (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z)));
            },
        );
    }


    recp<arr> (a:Tensor<arr>){
        return this.applyfn(
            a, 
            (z:number)=>{
                return 1/z;
            },
            (z:number)=>{
                return -1/(z*z);
            }
        )
    }

    protected applyfn<arr> (a:Tensor<arr>, fn:(a:number)=>number, delta:(a:number)=>number) {
        let res = new Tensor(new Array(a.value.data.length).fill(0), a.value.shape, a.value.is_sparse);
        
        res.parents = [a, null];

        res.feed = ()=>{
            ops.applyfn(a.value, res.value, fn);
        }
  
        res.feed();
  
        res.back = ()=>{
            let grad = new nArray(new Array(a.grad.data.length).fill(0), a.grad.shape, a.grad.is_sparse);
            ops.applyfn(a.value, grad, delta);
            
            ops.basic(res.grad, grad, grad, ops.basic_types.mul);

            ops.basic(grad, a.grad, a.grad, ops.basic_types.add);
        }

        return res;
    }


    public optimizer = {

        SGD:<arr>(parameters:Tensor<arr>[], lr:number) => {
            return new SGD(parameters, lr);
        }

    }
}


class SGD <arr>{
    constructor(private parameters:Tensor<arr>[], private lr:number){}

    step(){
        this.parameters.forEach(t => {
            for(let i = 0; i < t.value.data.length; i++) {
                t.value.data[i] -= t.grad.data[i] * this.lr;
            }
        })
    }
}