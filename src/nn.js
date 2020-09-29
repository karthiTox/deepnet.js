const fs = require("fs")
const path = require("path")
const util = require("./utilities/util")
const constuct = require("./constructor")
const math = require("./math/entry")
const { error } = require("console")
const Matrix = math.Matrix

class nn{
    constructor(){        
        this.layers = []; 
        this.biases = [];
        this.weights = [];              
        this.m = [];

        // Dependent variable
        this.a = [];
        this.z = [];
        this.err = [];

        // Props
        this.learningRate = 0.04;                
        
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

    initParm(){
        for(let l = 1; l < this.layers.length; l++){
            this.a[l] = [] 
            this.z[l] = [];
            this.err[l] = [];

            this.biases[l] = [];
            this.m[l] = [];
            this.weights[l] = [];                                               

            for(let n = 0; n < this.layers[l]; n++){
                this.biases[l][n] = util.ranBiases(this.layers[l-1]); 
                this.m[l][n] = 1; 
                this.weights[l][n] = []                
                for(let w=0; w < this.layers[l - 1]; w++){
                    this.weights[l][n][w] = util.ranWeight(this.layers[l-1]); 
                }
            }

        }
    }

    initActivation(activation = constuct.activation.sig){
        for(let l = 1; l < this.layers.length; l++){
            this.act[l] = activation[0]
            this.actPrime[l] = activation[1]
        }
    }

    save(name = ""){
        // const test = {
        //     layer : this.layers = []; 
        //     biaes : this.biases = [];
        //     weights: this.weights = [];              
        //     m : this.m = [];
    
        //     // Dependent variable
        //     a: this.a = [];
        //     z: this.z = [];
        //     err: this.err = [];
    
        //     // Props
        //     learningRate: this.learningRate = 0.04;                
            
        //     act: this.act = [];
        //     actPrime: this.actPrime = [];
        // }

        const test = {}
        Object.assign(test, this)
        test.act = test.act.map(f => f.name)
        test.actPrime = test.actPrime.map(f => f.name)         
        fs.writeFileSync(path.join(__dirname, '../savefiles/')+name+".json", JSON.stringify(test, null, 4))        
    }

    getfn(obj){
        return Object.values(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj))).map(v => v.value)
    }

    load(name = ""){
        try{
            let val = fs.readFileSync(path.join(__dirname, '../savefiles/')+name+".json")
            val = JSON.parse(val)
            Object.assign(this, val)

            const fns = this.getfn(util.activation)
            
            val.act.forEach((name, i) => {
                fns.forEach(f => {
                    if(f.name == name){
                        this.act[i] = f;
                    }
                })
            });

            val.actPrime.forEach((name, i) => {
                fns.forEach(f => {
                    if(f.name == name){
                        this.actPrime[i] = f;
                    }
                })
            });
        }catch{
            console.warn("network is not loaded");
        }
    }

    feedForword(inputs = [], dropoutAll = false){
        if(inputs.length != this.layers[0]) throw new Error("Inputs are out of dimension");
        let ip = inputs;
        this.a[0] = inputs;

        for(let l = 1; l < this.layers.length; l++){
            // Adding droupout Layer               
            if(l != this.layers.length - 1 && dropoutAll){
                this.m[l] = this.m[l].map(m => 1);
                const index = Math.round(Math.random()*inputs.length-1) % this.m[l].length            
                this.m[l][index] = 0;                            
            }
            
            // Feed forword            
            let res = Matrix.multiply([ip], Matrix.transform(this.weights[l]))                  
            res = Matrix.pointwiseAddition(this.biases[l], res[0])                        
            res = Matrix.pointwiseMultiply(res, this.m[l])            
            this.z[l] = res
            this.a[l] = this.act[l](res)
            ip = this.a[l];              
        }
                
        return ip;
    }

    backPropagation(target = [], costfn = constuct.costfn.CrossEntropy){
        if(target.length != this.layers[this.layers.length - 1]) throw new Error("Outputs are out of dimension");
        // calculating err
        const oi = this.a.length - 1        
        this.err[oi] = costfn.delta(this.a[oi], target, this.actPrime[oi](this.z[oi]))        

        for(let h = this.layers.length - 2; h > 0; h-- ){     
            this.err[h] = Matrix.multiply([this.err[h+1]], this.weights[h+1]);                        
            this.err[h] = Matrix.pointwiseMultiply(this.err[h][0], this.actPrime[h](this.z[h]));
            this.err[h] = Matrix.pointwiseMultiply(this.err[h], this.m[h]);            
        }
        
        // updating props
        for(let wl = 1; wl < this.layers.length; wl++){
            for(let n = 0; n < this.layers[wl]; n++){
                this.biases[wl][n] -= (this.learningRate * this.err[wl][n]);                
                for(let w = 0; w < this.weights[wl][n].length; w++){                    
                    const change = this.a[wl - 1][w] * this.err[wl][n];
                    this.weights[wl][n][w] -= this.learningRate * change;                        
                }
            }
        }
        
        return this.calculateTotalErr(target, costfn)
    }

    calculateTotalErr(target, costfn = constuct.costfn.Quatratic){
        const err = costfn.fn(this.a[this.layers.length - 1], target);             
        return costfn.totalerr(err)
    }

    predict(inputs = []){
        let ip = inputs;

        for(let l = 1; l < this.layers.length; l++){                                                
            let res = Matrix.multiply([ip], Matrix.transform(this.weights[l]))                  
            res = Matrix.pointwiseAddition(this.biases[l], res[0])                                                                  
            ip = this.act[l](res)
        }
                
        return ip;
    }

    train({ 
        inputs=[], 
        outputs=[], 
        learningRate=0.04, 
        iterations=10,
        costfunction=constuct.lossfn.Quatratic,
        log=this.log,
        logAt=false,
        dropoutAll=false
    }){
        this.learningRate = learningRate;
        for(let i = 0; i < iterations; i++){
          this.feedForword(inputs[i % inputs.length], dropoutAll)  
          const te = this.backPropagation(outputs[i % inputs.length], costfunction)
            
          if(logAt != false){
            if(i % logAt == 0 || i == 0 || i == iterations-1){
                log(i, te);    
            }
          }

        }
    }

    log(i, err){
        console.log("iteration: "+i+" total error: "+err + "\n")
    }
    
}

module.exports = nn


