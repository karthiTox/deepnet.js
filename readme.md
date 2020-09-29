# deepnet.js

![GitHub Logo](/logo.png)

## What is this ?
this is a neural network pakage implemented using javascript.

## what are neural nets this pakage have ?
- [x] Vanilla neural network
- [ ] RNN - ( under construction )
- [ ] LSTM
- [ ] CNN

### How to use this pakage ?

* Import the required pakages

```javascript
const deepjs = require("../index");
const construct = deepjs.constructor;
```

* create the modal

```javascript
const model = new deepjs.StandardNet() 
// or else
const model = new deepjs.VanillaNet() 
```

* build layers

    * build using create method:
    ```javascript
    model.create({
        layers:[2, 4], // [ number of nurons ]        
    })
    ```

    * build using add method:
     ```javascript
    model.add({
        neurons: 1,
        activation: construct.activation.reLU // specify the activation seperatly
        // Activation functions :
        // ReLU
        // sigmoid
        // softmax 
    })
    ```

* Train the model

```javascript
model.train(
    { 
        inputs: [                        
            // Inputs..
            [1, 1] //...           
            [0, 0] //...           
        ],
        outputs: [       
            // Respective outputs..   
            [0] //...           
            [1] //...                             
        ],
        learningRate: 0.04,
        iterations: 100, 
        costfunction: construct.costfn.CrossEntropy, // specify loss function
        log: (iteration, err)=>{ console.log(iteration, err) } // custom log method
        logAt: 50 || false, // it will log after every 50 iteration
        dropoutAll: true || false, // false        
    }
)
```

* Test the model

```javascript
model.predict([1, 0, 0, 0, 0, 0, 0, 0, 0, 0]).map(v => Math.round(v)),
```