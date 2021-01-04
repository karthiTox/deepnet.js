import { Tensor } from "../../tensor";

export function applyfn<arr>(a:Tensor<arr>, act:any){
    const res = a.data.map(v => act(v));
    const shape = Array.from(a.shape);
    
    return new Tensor(
        res,
        shape
    )
}