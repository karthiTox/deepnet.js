module.exports = class act{
    static sig(z) {
        return 1.0 / ( 1.0 + Math.exp(-z) )
    }
    
    static sigPrime(z){
        return (1.0 / ( 1.0 + Math.exp(-z) )) * (1 - (1.0 / ( 1.0 + Math.exp(-z) )))
    }

    static tanh(z){
        return (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z) )
    }

    static tanhPrime(z){
        return 1 - ((Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z) ) * (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z) ))
    }

    static reLU(z){
        return Math.max(0, z)
    }
    
    static reLUprime(z){
        if(z > 0){
            return 1;
        }else{
            return 0;
        }
    }
}