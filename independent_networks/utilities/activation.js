class act{
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

module.exports = class activation extends act{
    mini(){
        return {
            sig: super.sig,
            sigPrime: super.sigPrime,

            tanh: super.tanh,
            tanhPrime: super.tanhPrime,
        }
    }

    sig(zArr = []){
        const res = [];
        zArr.forEach(z => {
            res.push(super.sig(z))
        })
        return res
    }

    sigPrime(zArr = []){
        const res = [];
        zArr.forEach(z => {
            res.push(super.sigPrime(z))
        })
        return res
    }

    tanh(zArr = []){
        const res = [];
        zArr.forEach(z => {
            res.push(super.tanh(z))
        })
        return res
    }

    tanhPrime(zArr = []){
        const res = [];
        zArr.forEach(z => {
            res.push(super.tanhPrime(z))
        })
        return res
    }

    reLU(zArr = []){
        const res = [];
        zArr.forEach(z => {
            res.push(super.reLU(z))
        })
        return res
    }

    reLUprime(zArr = []){
        const res = [];
        zArr.forEach(z => {
            res.push(super.reLUprime(z))
        })
        return res
    }

    softmax(zArr = []){
        let re = 0; 
        let m = Math.max(...zArr);
        zArr.forEach(r => {
            re += Math.exp(r - m);
        });
        return zArr.map(z => Math.exp(z - m)/re);
    }

    // this derivative is wrong....
    softmaxPrime(zArr = []){
        let re = 0; 
        let m = Math.max(...zArr);

        zArr.forEach(r => {
            re += Math.exp(r - m);
        });
        return zArr.map(z => {
            let a = Math.exp(z - m)/re
            return a * ( 1 - a )
        });              
    }
}