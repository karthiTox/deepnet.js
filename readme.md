# deepnet.js

<img src="logo.png" width="200" height="200" />

## What is this ?
this is a neural network pakage implemented for javascript.

## what are neural nets this pakage have ?
- [x] Vanilla neural network
- [x] RNN 
- [ ] LSTM - ( under construction )
- [ ] CNN

### How to use this pakage ?

* Import the required pakages

```javascript
const deepjs = require("../index");
const construct = deepjs.constructor;
```

* create the modal

```javascript
const model = new deepjs.StandardNet();

// available neural networks

// feed forword neural network
new deepjs.StandardNet();

// recurrent neural network
new deepjs.recurrent.rnn();
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
    * Construct the parameters using construct method:
    ```javascript
    model.construct() // this should be called before train method
    ```

* Train the model

```javascript
model.train(
    { 
        inputs: [                        
            // Inputs..
            // FOR NN
            [1, 1] // i = 0
            [0, 0] // i = 1

            // FOR RNN
            // i = 0
            [
                [1, 1], // t = 0
                [0, 0], // t = 1
            ],
            // i = 1
            [
                [1, 1], // t = 0
                [0, 0], // t = 1
            ],
        ],
        outputs: [       
            // Respective outputs..   
            // FOR NN
            [0] // o = 0
            [1] // o = 1
        
            // FOR RNN
            // o = 0
            [
                [1], // t = 0
                [0], // t = 1
            ],
            // o = 1
            [
                [1], // t = 0
                [0], // t = 1
            ],
            
        ],
        learningRate: 0.04,
        iterations: 100, 
        costfunction: construct.costfn.CrossEntropy, // specify loss function
        log: (iteration, err)=>{ console.log(iteration, err) }, // custom log method
        logAt: n || false, // it will log after every n iteration
        dropoutAll: true || false, // false        
    }
)
```

* Test the model

```javascript
model.predict([1, 1]);
model.predict([0, 0]);
```

