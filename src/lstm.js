var util = require("./utilities/util")
const {Matrix} = require("./math/entry")

class Layer{
    constructor(name, numNurons, weights, hiddenWeights, biases){
        this.name = name
        this.numNurons = numNurons;
        this.weights = weights;
        this.hiddenWeights = hiddenWeights;
        this.biases = biases    
        // this.print()
    }

    print(){
        console.group("["+this.name+"]")
        console.log("num nurons")
        console.log(this.numNurons)
        console.log("weights")
        console.log(this.weights)
        console.log("hidden weights")
        console.log(this.hiddenWeights)
        console.log("biases")
        console.log(this.biases)
        console.groupEnd()
    }
}

class lstm{
    constructor(numInputs = 2, numOutputs = 2, learningRate = 0.1){
        this.learningRate = learningRate 
        this.numInputs = numInputs;
        this.numOutputs = numOutputs;

        this.layers = [
            this.generateLayer("aLayer", numInputs, numOutputs),
            this.generateLayer("iLayer", numInputs, numOutputs),
            this.generateLayer("fLayer", numInputs, numOutputs),
            this.generateLayer("oLayer", numInputs, numOutputs),            
        ]

        this.log = {
            feed: false
        }
    }

    generateLayer(name, numInputs = 1, numOutputs = 1){
        const weights = []
        const hiddenWeights = []
        const biases = []
        for(let n = 0; n < numOutputs; n++){
            weights[n] = []
            hiddenWeights[n] = []
            biases[n] = util.ranBiases()
            for(let w = 0; w < numInputs; w++){
                weights[n][w] = util.ranWeight()
            }
            for(let hw = 0; hw < numOutputs; hw++){
                hiddenWeights[n][hw] = util.ranWeight()
            }
        }
        return new Layer(name, numOutputs, weights, hiddenWeights, biases)
    }
    
    // passing value to nets         
    feed(input, hiddenInput, prevState){
        const op = [];    
        for(let l = 0; l < this.layers.length; l++){
            const layer = this.layers[l];
            op[l] = [];

            for(let n = 0; n < layer.numNurons; n++){
    
                op[l][n] = layer.biases[n];
    
                for(let w = 0; w < layer.weights[n].length; w++){
                    op[l][n] += input[w] * layer.weights[n][w];                    
                }

                for(let hw = 0; hw < layer.hiddenWeights[n].length; hw++){                    
                    op[l][n] += hiddenInput[hw] * layer.hiddenWeights[n][hw];
        
                }
                op[l][n] = layer.name == "aLayer" ? util.activation.mini().tanh(op[l][n]) : util.activation.mini().sig(op[l][n]);
    
    
            }
        }

        
        const init1 = Matrix.pointwiseMultiply(op[0], op[1])
        const init2 = Matrix.pointwiseMultiply(op[2], prevState)
        const state = Matrix.pointwiseAddition(init1, init2)

        const out = Matrix.pointwiseMultiply(state.map(re => util.activation.mini().tanh(re)), op[3])
        if(this.log.feed) console.log("Final o/p: ", [op, state, out])
        if(this.log.feed) console.groupEnd()
        return [op, state, out]
    }

    train(_inputs, _outputs){        
        for(let ip = 0 ; ip < _inputs.length; ip++){
            const inputs = _inputs[ip];
            const outputs = _outputs[ip];
            
            let hiddenInputs = [outputs[0].map(v => v*0)]
            
            let inter = this.feedForword(inputs, hiddenInputs)
            const val = inter[0]
            hiddenInputs = inter[1]
            
            this.backPropagatonTroughTime(val, inputs,  outputs, hiddenInputs)                      
        }
    }

    feedForword(inputs, _hiddenInput){        
        let hiddenInputs = _hiddenInput
        const val = []

        for(let t = 0; t < inputs.length; t++){            
            if(t == 0){
                val.push(this.feed(inputs[t], hiddenInputs[t], hiddenInputs[t])) // t = 0
            }else{            
                val.push(this.feed(inputs[t], val[t-1][2], val[t-1][1])) // t = 0
            }
            hiddenInputs.push(val[t][2])         
        }

        return [val, hiddenInputs]
    }

    test(inputs){        
        let hiddenInputs = [[]]
        for(let hn = 0; hn < this.numOutputs; hn++){
            hiddenInputs[0][hn] = 0;
        }    
        const val = []
        const op = []

        for(let t = 0; t < inputs.length; t++){            
            if(t == 0){
                val.push(this.feed(inputs[t], hiddenInputs[t], hiddenInputs[t])) // t = 0
            }else{            
                val.push(this.feed(inputs[t], val[t-1][2], val[t-1][1])) // t = 0
            }
            hiddenInputs.push(val[t][2])         
            op.push(val[t][2])
        }

        return op
    }

    backPropagatonTroughTime(val, inputs, outputs, hiddenInputs){
        let del_out = outputs[0].map(v => v*0)
        let prevErr = []
        
        for(let t = val.length-1; t >= 0; t--){
            let vals = []
            vals[0] = t != 0 ? val[t-1][0] : val[t][0].map(ar => ar.map(v => v*0))// [op0, state0, out0]
            vals[1] = t != 0 ? val[t-1][1] : val[t][1].map(v => v*0)// [op0, state0, out0]
            vals[2] = t != 0 ? val[t-1][2] : val[t][2].map(v => v*0)// [op0, state0, out0]
            
            let vals1 = val[t] // [op1, state1, out1]
            
            let vals2 = []
            vals2[0] = t != val.length-1 ? val[t+1][0] : val[t][0].map(ar => ar.map(v => v*0))// [op0, state0, out0]
            vals2[1] = t != val.length-1 ? val[t+1][1] : val[t][1].map(v => v*0)// [op0, state0, out0]
            vals2[2] = t != val.length-1 ? val[t+1][2] : val[t][2].map(v => v*0)// [op0, state0, out0]
            
            const prevState = vals[1]        

            const op = vals1[0]
            const state = vals1[1]
            const out = vals1[2]

            let del_e = Matrix.pointwiseAddition(out, outputs[t].map(r => -1*r))
            
            let err_out = Matrix.pointwiseAddition(del_e, del_out)
            
            let err_state = Matrix.pointwiseMultiply(err_out, op[3])
            let inter = state.map(r => util.activation.mini().tanhPrime(r))
            err_state = Matrix.pointwiseMultiply(err_state, inter)
            if(prevErr.length != 0){                
                let inter2 = Matrix.pointwiseMultiply(prevErr, vals2[0][2])        
                err_state = Matrix.pointwiseAddition(err_state, inter2)
            }            
            prevErr = err_state

            

            let err_a = Matrix.pointwiseMultiply(err_state, op[1])
            err_a = Matrix.pointwiseMultiply(err_a, op[0].map(r => 1 - (r*r)))
            
            let err_i = Matrix.pointwiseMultiply(err_state, op[0])
            err_i = Matrix.pointwiseMultiply(err_i, op[1])
            err_i = Matrix.pointwiseMultiply(err_i, op[1].map(r => 1 - r))

            let err_f = Matrix.pointwiseMultiply(err_state, prevState)
            err_f = Matrix.pointwiseMultiply(err_f, op[2])
            err_f = Matrix.pointwiseMultiply(err_f, op[2].map(r => (1-r)))

            let err_o = Matrix.pointwiseMultiply(err_out, state.map(r => util.activation.mini().tanh(r)))
            err_o = Matrix.pointwiseMultiply(err_o, op[3])
            err_o = Matrix.pointwiseMultiply(err_o, op[3].map(r => 1-r))

            const err_x = []
            del_out = [] // need to change

            for(let l = 0; l < this.layers.length; l++){
                const layer = this.layers[l]
                for(let n = 0; n < layer.numNurons; n++){            
                    let err = [];
                    if(layer.name == "aLayer") err = err_a
                    if(layer.name == "iLayer") err = err_i
                    if(layer.name == "fLayer") err = err_f
                    if(layer.name == "oLayer") err = err_o

                    for(let w = 0; w < layer.weights[n].length; w++){
                        if(!err_x[w]) err_x[w] = 0                    
                        err_x[w] += err[n] * layer.weights[n][w]
                    }
                    for(let hw = 0; hw < layer.hiddenWeights[n].length; hw++){
                        if(!del_out[hw]) del_out[hw] = 0                                        
                        del_out[hw] += err[n] * layer.hiddenWeights[n][hw] 
                    }
                }
            }
        
            
            this.updateErr(err_a, err_i, err_f, err_o, inputs[t], hiddenInputs[t])
        
        }        
    }

    updateErr(_err_a, _err_i, _err_f, _err_o, inputs, hiddenInputs){        
        for(let l = 0; l < this.layers.length; l++){
            const layer = this.layers[l]
            for(let n = 0; n < layer.numNurons; n++){
                let err = [];                
                if(layer.name == "aLayer") err = _err_a
                if(layer.name == "iLayer") err = _err_i
                if(layer.name == "fLayer") err = _err_f
                if(layer.name == "oLayer") err = _err_o
                
                layer.biases[n] -= err[n] * this.learningRate
                
                for(let w = 0; w < layer.weights[n].length; w++){                    
                    layer.weights[n][w] -= err[n] * inputs[w] * this.learningRate // l rate                    
                }    
                for(let hw = 0; hw < layer.hiddenWeights[n].length; hw++){                    
                    layer.hiddenWeights[n][hw] -= err[n] * hiddenInputs[hw] * this.learningRate // l rate                    
                }             
            }
        }
    }
}

module.exports = lstm




