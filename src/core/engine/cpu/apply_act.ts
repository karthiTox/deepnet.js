import { tensor } from "../tensor";

export function apply_activation<arr>(a:tensor<arr>, act:any){
    const res = a.data.map(v => act(v));
    const shape = Array.from(a.shape);
    
    return new tensor(
        res,
        shape
    )
}