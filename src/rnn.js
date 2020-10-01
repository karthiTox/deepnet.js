const util = require("./utilities/util")
const construct = require("./constructor");
const math = require("./math/entry");
const Matrix = math.Matrix;

module.exports = class rnn{
    constructor(){
        this.lr = 0.04

        // main
        this.z = [];
        this.a = [];
        this.m = [];
        this.err = [];

        // props
        this.layers = [];

        this.weights = [];
        this.biases = [];
        
        this.hiddenWeights = [];
        this.hiddenBiases = []; 
        
        this.act = [];
        this.actPrime = [];
    }

    create({layers, activation}){
        if(layers == undefined || layers.length == 0){            
            throw new Error("layers are not specified");
        }
        else if(activation == undefined){            
            throw new Error("activation is not specified");
        }
        this.layers = layers;        
        this.initActivation(activation);                        
    }

    add({neurons, activation}){
        const count = this.layers.length;
        if(neurons == undefined){            
            throw new Error("layers are not specified");
        }
        else if(activation == undefined && count != 0){            
            throw new Error("activation is not specified");
        }
        if(count == 0){
            this.layers[count] = neurons;
        }
        else{
            this.layers[count] = neurons;
            this.act[count] = activation[0];
            this.actPrime[count] = activation[1];
        }    
    }

    construct(){
        if(this.layers.length == 0){            
            throw new Error("layers must be created before construction");
        }
        else if(this.layers.length == 1){            
            throw new Error("More than one layer is need to construct");
        }
        this.initParm();
    }

    initActivation(activation = construct.activation.sig){
        for(let l = 1; l < this.layers.length; l++){
            this.act[l] = activation[0]
            this.actPrime[l] = activation[1]
        }
    }

    initParm(){
        for(let l = 1; l < this.layers.length; l++){

            this.weights[l] = [];
            this.biases[l] = [];

            if(l != this.layers.length-1){
                this.hiddenWeights[l] = [];
                this.hiddenBiases[l] = [];                
            }

            for(let n = 0; n < this.layers[l]; n++){
                // normal weights
                const weights = [];
                this.biases[l][n] = util.ranBiases(this.layers[l - 1]);
                for(let w = 0; w < this.layers[l - 1]; w++){
                    weights.push(util.ranWeight(this.layers[l - 1]))
                } 
                this.weights[l][n] = weights;

                // hidden weights
                if(l != this.layers.length-1){                              
                    this.hiddenBiases[l][n] = util.ranBiases(this.layers[l - 1]);
                    const weights = [];
                    for(let w = 0; w < this.layers[l]; w++){
                        weights.push(util.ranWeight(this.layers[l - 1]))
                    } 
                    this.hiddenWeights[l][n] = weights;
                }
            }

        }
    }

    feedForword(inputs = [[], [], []], dropoutAll = true){        
        let ip = [];
        let op = [];

        for(let i = 0; i < inputs.length; i++){
            ip = inputs[i];
            this.a[i] = [];            
            this.z[i] = [];
            this.err[i] = [];
            this.a[i][0] = inputs[i];            
            this.z[i][0] = inputs[i];
            this.err[i][0] = new Array(inputs[i].length).fill(0);
    
            for(let l = 1; l < this.layers.length; l++){
                // dropout
                this.m[l] = new Array(this.layers[l]).fill(1);
                
                if(l != this.layers.length - 1 && dropoutAll){
                    const index = Math.round(Math.random()*inputs[i].length-1) % this.m[l].length            
                    this.m[l][index] = 0;                            
                }
                
                let res = Matrix.multiply([ip], Matrix.transform(this.weights[l]))[0];
                res = Matrix.pointwiseAddition(this.biases[l], res);                  
                
                // hiddem weights
                if(this.hiddenWeights[l]){             
                    let a = i == 0 ? new Array(this.hiddenWeights[l].length).fill(0) : this.a[i - 1][l]                           
                    let hres = Matrix.multiply([a], Matrix.transform(this.hiddenWeights[l]))[0];
                    hres = Matrix.pointwiseAddition(this.hiddenBiases[l], hres);
                    res = Matrix.pointwiseAddition(hres, res);
                }

                res = Matrix.pointwiseMultiply(res, this.m[l])            

                this.z[i][l] = res
                this.err[i][l] = new Array(res.length).fill(0);
                this.a[i][l] = this.act[l](res)
                ip = this.a[i][l]
            }

            op.push(ip)
        }
        return op;
    }


    bpt(target = [], i, costfn = construct.costfn.CrossEntropy){               
        for(let t = target.length - 1; t >= 0; t--){
            let oi = this.layers.length - 1       
            this.err[t][oi] = costfn.delta(this.a[t][oi], target[t], this.actPrime[oi](this.z[t][oi])) 
            
            
            for(let h = this.layers.length - 2; h > 0; h-- ){     
                let err = Matrix.multiply([this.err[t][h+1]], this.weights[h+1])[0];                        
                err = Matrix.pointwiseMultiply(err, this.actPrime[h](this.z[t][h]));
    
                if(this.hiddenWeights[h]){
                    let e = t == target.length - 1 ? new Array(this.hiddenWeights[h].length).fill(0) : this.err[t + 1][h];
                    let herr = Matrix.multiply([e], this.hiddenWeights[h])[0];
                    herr = Matrix.pointwiseMultiply(herr, this.actPrime[h](this.z[t][h]));
                    err = Matrix.pointwiseAddition(herr, err);
                }

                err = Matrix.pointwiseMultiply(err, this.m[h])
                this.err[t][h] = Matrix.pointwiseAddition(err, this.err[t][h]);            
            }
        }

        for(let t = target.length - 1; t >= 0; t--){
            for(let wl = 1; wl < this.layers.length; wl++){
                for(let n = 0; n < this.layers[wl]; n++){
                    this.biases[wl][n] -= this.lr * this.err[t][wl][n];                
                    for(let w = 0; w < this.weights[wl][n].length; w++){                    
                        const change = this.a[t][wl - 1][w] * this.err[t][wl][n];
                        this.weights[wl][n][w] -= this.lr * change;                        
                    }
                }
            }
        }
        
        for(let t = target.length - 1; t >= 0; t--){
            for(let l = this.layers.length-2; l > 0; l--){

                for(let n=0; n < this.layers[l]; n++){    
                    this.hiddenBiases[l][n] -= this.lr * this.err[t][l][n];                
                    for(let w=0; w < this.hiddenWeights[l][n].length; w++){
                        const a = t != 0 ? this.a[t-1][l][w] : 0 ;
                        this.hiddenWeights[l][n][w] -= (this.lr * this.err[t][l][n] * a)
                    }
                }

            }
        }

    }

    predict(inputs = [[], [], []]){        
        let ip = [];
        let op = [];

        for(let i = 0; i < inputs.length; i++){
            ip = inputs[i];
            this.a[i] = [];                                    
            this.a[i][0] = inputs[i];                                    
    
            for(let l = 1; l < this.layers.length; l++){                            
                let res = Matrix.multiply([ip], Matrix.transform(this.weights[l]))[0];
                res = Matrix.pointwiseAddition(this.biases[l], res);                  
                
                // hiddem weights
                if(this.hiddenWeights[l]){             
                    let a = i == 0 ? new Array(this.hiddenWeights[l].length).fill(0) : this.a[i - 1][l]                           
                    let hres = Matrix.multiply([a], Matrix.transform(this.hiddenWeights[l]))[0];
                    hres = Matrix.pointwiseAddition(this.hiddenBiases[l], hres);
                    res = Matrix.pointwiseAddition(hres, res);
                }                
                
                this.a[i][l] = this.act[l](res)
                ip = this.a[i][l]
            }

            op.push(ip)
        }
        return op;
    }

    train({ 
        inputs=[], 
        outputs=[], 
        learningRate=0.04, 
        iterations=10,
        costfunction=constuct.lossfn.Quatratic,
        log=() => {},
        logAt=false,
        dropoutAll=false
    }){
        this.lr = learningRate;
        for(let i = 0; i < iterations; i++){
          this.feedForword(inputs[i % inputs.length], dropoutAll)  
          this.bpt(outputs[i % inputs.length], costfunction)            
        }
    }    

}


