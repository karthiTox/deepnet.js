import { ops_cpu, Tensor } from "./tensor_ops";

export class activations extends ops_cpu {
    constructor() {
        super();        
    }

    public activations = {
        linear: <arr> (a:Tensor<arr>, m:number = 1)=>{
            return this.applyfn(
                a, 
                (z:number)=>{
	                return m*z
                },
                (z:number)=>{
	                return m    

                }
            )
        },

        Elu: <arr> (a:Tensor<arr>, alpha:number = 1)=>{
            return this.applyfn(
                a, 
                (z:number) => {
	                if (z >= 0)
                        return z 
                    else 
                        return alpha*(Math.exp(z) -1)
                },
                (z:number) => {
                    if (z > 0)
                        return 1
                    else 
                        return alpha * Math.exp(z)
                }
            )
        },

        Relu: <arr> (a:Tensor<arr>)=>{
            return this.applyfn(
                a, 
                (z:number)=>{
                    return Math.max(0, z);
                },
    
                (z:number)=>{
                    if (z > 0) 
                        return 1;
                    else 
                        return 0;                    
                }
            );
        },

        leakyRelu: <arr> (a:Tensor<arr>, alpha:number = 1)=>{
            return this.applyfn(
                a, 
                (z:number)=>{
                    return Math.max(alpha * z, z);
                },
    
                (z:number)=>{
                    if (z > 0) 
                        return 1;
                    else 
                        return alpha;                    
                }
            );
        },

        sigmoid: <arr>(a:Tensor<arr>) => {                
            return this.applyfn(
                a,
                (z:number)=>{
                    return 1.0 / (1.0 + Math.exp(-1 * z));
                },
                (z:number)=>{
                    return (1.0 / (1.0 + Math.exp(-1 * z))) * (1 - (1.0 / (1.0 + Math.exp(-1 * z))));
                },            
            );
        },

        tanh:<arr>(a:Tensor<arr>) => {        
            return this.applyfn(
                a, 
    
                (z:number)=>{
                    return (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z));
                },
    
                (z:number)=>{
                    return 1 - ((Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z)) * (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z)));
                },
            );
        }
    }
}