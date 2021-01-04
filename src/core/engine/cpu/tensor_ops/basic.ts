import { check_shape } from '../../checks';
import { Tensor } from '../../Tensor';

export function add<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{    
    check_shape(a, b);

    const res:number[] = [];
    for(let el = 0; el < a.data.length; el++){
        res[el] = a.data[el] + b.data[el]
    }

    return new Tensor(res, a.shape);    
}

export function sub<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    check_shape(a, b);
    
    const res:number[] = [];
    for(let el = 0; el < a.data.length; el++){
        res[el] = a.data[el] - b.data[el]
    }    

    return new Tensor(res, a.shape);    
}

export function multiply<arr>(a:Tensor<arr>, b:Tensor<arr>):Tensor<arr>{
    check_shape(a, b);
    
    const res:number[] = [];
    for(let el = 0; el < a.data.length; el++){
        res[el] = a.data[el] * b.data[el]
    }    

    return new Tensor(res, a.shape);    
}