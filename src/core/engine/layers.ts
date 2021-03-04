import { ops_cpu } from "./cpu/tensor_ops";

class nn {

    constructor(private platform:ops_cpu) {

    }
    
    Linear(in_features:number, out_features:number, bias:boolean = true){
        
        function feed(input:any){                        
                
            let m_res = this.platform.matmul(input, this.platform.transpose(feed.weights));
    
            if(bias)
                return this.platform.add(m_res, feed.biases);
            else
                return m_res;
        }
    
        
        feed.in_features = in_features;
        feed.out_features = out_features;
        feed.weights = this.platform.randn([feed.out_features, feed.in_features]);
        feed.biases = this.platform.randn([1, feed.out_features]);  
    
        return feed;
        
    }    
        
 }