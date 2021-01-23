import * as autograd from "../core/engine/engine_entry";

export function RNN(in_features:number, out_features:number, return_sequence = true){ 
    
    function feed<arr>(input:autograd.return_type<arr>[]):autograd.return_type<arr>|autograd.return_type<arr>[]{
        let prev_output = autograd.zeros([1, feed.out_features])
        let res = [];

        for(let i = 0; i < input.length; i++){
            const inner1 = autograd.matmul(input[i], autograd.transpose(feed.weight))            
            const inner2 = autograd.matmul(prev_output, autograd.transpose(feed.hiddenWeight))

            const merg = autograd.add(
                autograd.add(inner1, inner2),
                feed.biases
            )

            res.push(merg);
        }

        if(feed.return_sequence)
            return res;
        else
            return prev_output;
    }  

    feed.in_features = in_features;
    feed.out_features = out_features;

    feed.weight = autograd.rand([out_features, in_features]);
    feed.biases = autograd.rand([1, out_features]);
        
    feed.hiddenWeight = autograd.rand([out_features, out_features]);

    feed.return_sequence = return_sequence;


    return feed;
    
}