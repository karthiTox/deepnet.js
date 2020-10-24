module.exports = new class act{
    sig(z) {
        return 1.0 / ( 1.0 + Math.exp(-z) )
    }
    
    sigPrime(z){
        return (1.0 / ( 1.0 + Math.exp(-z) )) * (1 - (1.0 / ( 1.0 + Math.exp(-z) )))
    }

    tanh(z){
        return (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z) )
    }

    tanhPrime(z){
        return 1 - ((Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z) ) * (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z) ))
    }

    reLU(z){
        return Math.max(0, z)
    }
    
    reLUprime(z){
        if(z > 0){
            return 1;
        }else{
            return 0;
        }
    }
}