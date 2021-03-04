import { activations } from "./activations";
import { Tensor } from "./tensor_ops";

export class loss extends activations {
    constructor(){
        super();        
    }

    // (y[i] * Math.log(a[i])) + ((1 - y[i]) * Math.log(1 - a[i]))  

    public loss = {
        testing: <arr>(a:Tensor<arr>, y:Tensor<arr>) => {
            return this.tensor(Array.from(a.value.data).map((a, i) => a - y.value.data[i]), a.value.shape);            
        },

        CrossEntropy: <arr>(a:Tensor<arr>, y:Tensor<arr>) => {
            const one = this.tensor([1]);

            return this.add(
                this.mul(y, this.log(a)),
                this.mul(this.sub(one, y), this.log(this.sub(one, a)))
            )
        }
    }
}