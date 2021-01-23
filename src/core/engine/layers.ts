import { ops_cpu } from "./cpu/tensor_ops";

export function Linear(backend:ops_cpu, in_features:number, out_features:number, bias:boolean = true){
        
    function feed(input:any){                        
             
    
        let m_res = backend.matmul(input, backend.transpose(feed.weights));

        if(bias)
            return backend.add(m_res, feed.biases);
        else
            return m_res;
    }

    
    feed.in_features = in_features;
    feed.out_features = out_features;
    feed.weights = backend.randn([feed.out_features, feed.in_features]);
    feed.biases = backend.randn([1, feed.out_features]);  

    return feed;
    
}    

export function dropout(backend:ops_cpu, in_features:number, out_features:number, bias:boolean = true) {
    function feed(input:any){                                         
        let m_res = backend.matmul(input, backend.transpose(feed.weights));

        if(bias)
            return backend.add(m_res, feed.biases);
        else
            return m_res;
    }

    
    feed.in_features = in_features;
    feed.out_features = out_features;
    feed.weights = backend.randn([feed.out_features, feed.in_features]);
    feed.biases = backend.randn([1, feed.out_features]);  

    return feed;
}