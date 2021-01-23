import * as autograd from "../core/engine/engine_entry";

export function Sigmoid(){

    function feed<arr>(input:autograd.return_type<arr>):autograd.return_type<arr>|autograd.return_type<arr>[]{ 
        if(Array.isArray(input)){
            
            let res:autograd.return_type<arr>[] = [];
            input.forEach(ip => res.push(autograd.Relu(ip)) );
            return res;

        }   

        return autograd.sigmoid(input)
    }

    feed.layer = true;

    return feed;
    
}    


export function Relu(){

    function feed<arr>(input:autograd.return_type<arr>|autograd.return_type<arr>[]){ 
        if(Array.isArray(input)){

            let res:autograd.return_type<arr>[] = [];
            input.forEach(ip => res.push(autograd.Relu(ip)) );
            return res;
            
        }
            
        return autograd.Relu(input);
    }

    feed.layer = true;

    return feed;
    
}  



export function Tanh(){

    function feed<arr>(input:autograd.return_type<arr>|autograd.return_type<arr>[]){ 
        if(Array.isArray(input)){

            let res:autograd.return_type<arr>[] = [];
            input.forEach(ip => res.push(autograd.tanh(ip)) );
            return res;
            
        }
            
        return autograd.tanh(input);
        
    }

    feed.layer = true;

    return feed;
    
}  