import * as ag from "../core/engine/engine_entry";

export function Linear(in_features:number, out_features:number, bias:boolean = true){
    // y = x @ w^t + b

    function feed<arr>(input:ag.return_type<arr>):ag.return_type<arr>{        
        // x @ w^t
        let weights;
        let biases;

        if(ag.is_vertex(input)){
            weights = ag.vertex(
                ag.rand([feed.out_features, feed.in_features])
            )
                
            biases = ag.vertex(
                ag.rand([1, feed.out_features])
            )

        }else{
            weights = ag.rand([feed.out_features, feed.in_features]);
            biases = ag.rand([1, feed.out_features]);
        }
    

        let m_res = ag.matmul(input, ag.transpose(weights));

        if(bias)
            // m_res + biase
            return ag.add(m_res, biases);
        else
            return m_res;
    }

    
    feed.in_features = in_features;
    feed.out_features = out_features;

    return feed;
    
}    



export function seqLinear(in_features:number, out_features:number, bias:boolean = true){
    // y = x @ w^t + b

    function feed<arr>(input:ag.return_type<arr>[]):ag.return_type<arr>[]{        
        let res:ag.return_type<arr>[] = [];
        for (let ip = 0; ip < input.length; ip++) {
            let linear_layer = Linear(feed.in_features, feed.out_features, bias);            
            res.push(
                linear_layer(input[ip])
            )
        }
        return res;
    }

    
    feed.in_features = in_features;
    feed.out_features = out_features;

    return feed;
    
}    