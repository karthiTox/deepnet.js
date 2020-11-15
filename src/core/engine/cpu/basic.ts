import{ tensor } from '../tensor';

export function add<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{    

    const res:number[] = [];
    for(let el = 0; el < a.data.length; el++){
        res[el] = a.data[el] + b.data[el]
    }

    return new tensor(res, a.shape);    
}

export function sub<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{
    const res:number[] = [];
    for(let el = 0; el < a.data.length; el++){
        res[el] = a.data[el] - b.data[el]
    }    

    return new tensor(res, a.shape);    
}

export function multiply<arr>(a:tensor<arr>, b:tensor<arr>):tensor<arr>{
    const res:number[] = [];
    for(let el = 0; el < a.data.length; el++){
        res[el] = a.data[el] * b.data[el]
    }    

    return new tensor(res, a.shape);    
}