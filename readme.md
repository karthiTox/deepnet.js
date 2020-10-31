# deepnet.js

<img src="logo.png" width="200" height="200" />

## What is this ?
ndarray and dynamic neural network with javascript.

deepnet pakage provides:
* ndarray computation with cpu using computational graph 
* neural network implemented on top of the ndarray
* Build a model using layer graph instead of using array

## What are the neural net layers this pakage have ?
- [x] Dense
- [x] RNN
- [x] LSTM
- [ ] CNN

## Examples

### Auto grad

* Import the required pakages

```javascript
const deepnet = require('../src/index');
const { ndarray, ndvertex } = deepnet.ndfn.objs;
const ops = deepnet.ndfn.ops;
```

* ndarray:

ndarray is used to do math operations over array, currently this pakage
supports basic operation, matrix operation and array manupuation, 
ndarray is not tracked while computation. instead use ndvertex while using cgraph

```javascript
const a = new ndarray(array, shape);

const a = new ndarray([1, 2, 3, 4], [2, 2]);
const a = new ndarray([[1, 2], [3, 4]]);
```

* ndvertex:

ndvertex is used to do math operations and this 
operations are tracked while computation.

```javascript
const a = new ndvertex(array, shape);

const a = new ndvertex([1, 2, 3, 4], [2, 2]);
const a = new ndvertex([[1, 2], [3, 4]]);
```

* Operations

    *  Import the required pakages 
    
    ```javascript
    const {
        add, sub, multiply, // basic ops 
        expand_to, transpose, matmul, concat,// Matrix
        traversal, backpass, update_loss, grad_zero, detach,
        genRan, genZero,
        apply_activation 
    } = deepnet.ndfn.ops;
    ```
    
    operations always returns ndvertex by default
    if you want a returntype as ndarray specify the return type while function call 

     ```javascript
    const a = new ndvertex([[1, 2], [3, 4]]);
    const b = new ndvertex([[1, 2], [3, 4]]);
    
    add(a, b, 'ndarray'); // => returns ndarray
    add(a, b); // => returns ndvertex

    sub(a, b);
    
    multiply(a, b);
    ```
    * Chaining
    
    Chain the operations together to do autograd

     ```javascript
    const a = new ndvertex([[1, 2]]);
    const w = new ndvertex([[1, 2], [3, 4]]);
    const b = new ndvertex([[1, 2], [3, 4]]);
        
    const tw = transpose(w);
    const mul = matmul(a, tw);    
    
    const res = add(mul, b);
    ```
    After chaining the operation pass the result (ndvertex) to the backpass.
    
      * backpass(result, error) compute derivatives of every variable.
      * update_loss(res, alpha) updates the computed derivates of each ndvertex.
      * grad_zero(res) set grad to zero after updated.
      * detach(res) removes the connection of between vertices.

     ```javascript
    const a = new ndvertex([[1, 2]]);
    const w = new ndvertex([[1, 2], [3, 4]]);
    const b = new ndvertex([[1, 2], [3, 4]]);
        
    const tw = transpose(w);
    const mul = matmul(a, tw);    
    
    const res = add(mul, b);

    const init_value = new ndarray([[1, 1], [1, 1]]);    
    backpass(res, err=init_value); 
    update_loss(res, alpha=0.04);
    grad_zero(res);
    detach(res);
    ```
## Layer Graph

Layer Graph, instead of using array, use graph to store layers, the output of one vertex/layer is passed to 
next vertex in next level. if vertex has two parents then the merge function is called before feed to layer.

* Layer graph building procedure
        
        Dense  Dense
           \    /
           Dense
    
    
    initialize a graph:    
    
    ```javascript
    const LayerGraph = deepnet.models.LayerGraph;
    const model = new LayerGraph();
    ```
    Graph is created on fly using add method

    ```javascript
    // const a = model.add(layer, parents, merge_function, Name_of_the_layer)
    const a = model.add(new dense(1, 2), null, null, "a");
    const b = model.add(new dense(1, 2), null, null, "b");
    const c = model.add(new dense(4, 1), [a, b], deepnet.mergefn.concat, "c");    
    
    //  a  b 
    //  \ /
    //   c
    ```
    
    ```javascript
    model.feedForword(c,{
        'a':[new ndvertex([[1]], [1, 1]), new ndvertex([[0]], [1, 1])],    
        'b':[new ndvertex([[1]], [1, 1]), new ndvertex([[0]], [1, 1])],    
    })    
    model.backpropagation([[0], [1]]);
    model.reset(c);
    ```

    * Creation flow

    ```javascript
    const a = model.add(new lstm(1, 2), null, null, "a");
   
    (a)
    ```
    
    ```javascript
    const b = model.add(new lstm(1, 2), null, null, "a");
    
    (a)  (b)
    ```
    
    ```javascript
    // merging two sequence input or two non-seq input is applicable
    // can't merge seq and non-seq input   
    const c = model.add(new lstm(2, 1), [a, b], deepnet.mergefn.add, "c"); 
    
    (a)  (b)
     \   /
      (c)
    ```
    
    ```javascript
    const d = model.add(new lstm(2, 1), [c], null, "c");        
    
    (a)  (b)
     \   /
      (c)
       |
      (d)
    ```
    
    ```javascript  
    const e = model.add(new lstm(2, 1), [d], null, "c");    
    const f = model.add(new lstm(2, 1), [d], null, "c");    
   
    (a)  (b)
     \   /
      (c)
       |
      (d)
      / \
    (e) (f)
   ```
    Now, there are two outputs from (e) and (f) so to get an output from (e)
    
    model.feedForword(e) gives the result of (e)
    
    model.feedForword(f) gives the result of (f)

    ```javascript
    /*
    model.feedForword(final_pointer, inputs);

    model.feedForword(final_pointer, inputs{
        name_of_input_vertex_1: input_1,    
        name_of_input_vertex_2: input_2,    
    })
    */

    model.feedForword(e,{
        'a':[ new ndvertex([[1]]), new ndvertex([[0]]) ], // for lstm and rnn  
        'b':[ new ndvertex([[1]]), new ndvertex([[0]]) ], // for lstm and rnn          
    })
    ```

    ```javascript
    // currently raw array is need to pass
    // next build will change this method
    model.backpropagation([
        [0], // t1 
        [1]  // t2
    ]);
    ```

    * Rest()
    it will reset output of every layer in the model. 

    Before pass:

   ```js
      (a)  (b)
       \   /
        (c)
         |
        (d)
        / \
      (e) (f)
   ```
   
    After pass:
    
        feedForword(e) - (e) vertex/layer flow from 
        (a)(b) => (c) => (d) => (e)
    
        every vertex remmembers the output so when you feedforword next time it did not 
        compute the values instead it returns output directly.
    
        (! - Output of the layer is remembered)
   ```javascript
      (a)!  (b)!
        \   /
        (c)!
         |
        (d)!
        / \
     (e)! (f)
    ```
    next Pass:

    feedForword(f):

    (f) vertex/layer flow is not from the origin.
    
    instead,
    
    (d)! => (f)

    if it needed to flow again from origin then you have to 
    reset() before calling feedForword

    ```javascript
    model.feedForword(e,{
        'a':[ new ndvertex([[1]]), new ndvertex([[0]]) ], // for lstm and rnn  
        'b':[ new ndvertex([[1]]), new ndvertex([[0]]) ], // for lstm and rnn          
    })

    // (a)!  (b)!
    //   \   /
    //    (c)!
    //     |
    //    (d)!
    //    / \
    // (e)! (f)

    reset(e) // <===========

    // (a)   (b)
    //   \   /
    //    (c)
    //     |
    //    (d)
    //    / \
    // (e)  (f)

    model.feedForword(f,{
        'a':[ new ndvertex([[1]]), new ndvertex([[0]]) ], // for lstm and rnn  
        'b':[ new ndvertex([[1]]), new ndvertex([[0]]) ], // for lstm and rnn          
    })

    // (a)!  (b)!
    //   \   /
    //    (c)!
    //     |
    //    (d)!
    //    / \
    // (e)  (f)!
    ```


* LSTM NETWORK EXAMPLE

```js
const deepnet = require('../src/index');
const { ndarray, ndvertex } = deepnet.ndfn.objs;
const { lstm, rnn, dense, seqdense } = deepnet.layers;
const mergefn = deepnet.mergefn;

const LayerGraph = deepnet.models.LayerGraph;
const model = new LayerGraph();

const a = model.add(new lstm(1, 2), null, null, "a");
const b = model.add(new lstm(1, 2), null, null, "b");
const c = model.add(new lstm(4, 1), [a, b], mergefn.concat, "c");

// not used but connected
const d = model.add(new seqdense(2, 1), [a, b], null, "d");

// Training
for(let i = 0; i < 1000; i++){
    model.feedForword(c,{
        'a':[new ndvertex([[1]], [1, 1]), new ndvertex([[0]], [1, 1])],    
        'b':[new ndvertex([[1]], [1, 1]), new ndvertex([[0]], [1, 1])],    
    })    
    model.backpropagation([[0], [1]]);
    model.reset(c);

    model.feedForword(c,{
        'a':[new ndvertex([[0]], [1, 1]), new ndvertex([[0]], [1, 1])],    
        'b':[new ndvertex([[0]], [1, 1]), new ndvertex([[0]], [1, 1])],    
    })    
    model.backpropagation([[0], [0]])
    model.reset(c)    
}

// Pridicting
model.feedForword(c,{
    'a':[new ndvertex([[1]], [1, 1]), new ndvertex([[0]], [1, 1])],    
    'b':[new ndvertex([[1]], [1, 1]), new ndvertex([[0]], [1, 1])],    
}).forEach(v => v.print());
model.reset(c)    

model.feedForword(c,{
    'a':[new ndvertex([[0]], [1, 1]), new ndvertex([[0]], [1, 1])],    
    'b':[new ndvertex([[0]], [1, 1]), new ndvertex([[0]], [1, 1])],    
}).forEach(v => v.print());
```
