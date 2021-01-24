## deepnet.js

<img src="logo.png" width="220" height="220" />

__deepnet.js__ is an auto-differentiation library for javascript. it will compute the gradients in both static and dynamic method.

> :warning: **Deepnet.js** is reimplemented from ground to support sparse tensor, broadcast
> and various backends are in development, If you are using the older versions (1.0.2 or below), 
> please upgrade your code accordingly.

## Installation

### NPM

```bash
npm install deepnet.js
```

### CDN

```CDN
https://unpkg.com/deepnet.js@latest/dist/deepnet-browser.min.js
https://unpkg.com/deepnet.js@latest/dist/deepnet-browser.js
```

## Usage

### Node

```js
const deepnet = require("deepnet.js");

deepnet.platforms.cpu().then((backend) => {
    
    let dn = backend;

    const a = dn.tensor([1, 2, 3, 4], [2, 2]);
    const b = dn.tensor([1, 2, 3, 4], [2, 2]);
    
    const result = dn.matmul( a, b );
    result.print();

})
```

### CDN

```html
<script src="https://unpkg.com/deepnet.js@latest/dist/deepnet-browser.min.js"></script>
<script>

    deepnet.platforms.cpu().then((backend) => {
    
        let dn = backend;

        const a = dn.tensor([1, 2, 3, 4], [2, 2]);
        const b = dn.tensor([1, 2, 3, 4], [2, 2]);

        const result = dn.matmul( a, b );
        result.print();

    })

</script>
```
## Getting started

### Table of Contents

* [Autodiff](#Autodiff)
* [Platforms/Backends](#PlatformsBackends)
* [Tensor](#Tensor)
* [Vertex - `deprecated`](#Vertex)
* [Operations](#Operations)
    * [Broadcasting](#Broadcasting)
    * [basic operations](#basic_operation)
    * [Matmul two Tensors](#Matmul_two_Tensors)
* [Available_methods](#Available_methods)
* [Backpass example](#Backpass_example)
* [fully connected example](#fully_connected_example)

### Autodiff

Autodiff (Automatic Differentitation) is a technique which uses a computational graph to compute a derivatives automatically. 

In the forward phase, it executes the math operation and constructs the computational graph, and In the backward phase, the dervatives are computed automatically.

### Platforms/Backends

Platforms adds support for various environments to run your neural networks.

* cpu(..), (js-environment) pure js implementaion for the browser and nodejs.

```js
deepnet.platforms.cpu().then((dn) => {        
    dn.tensor(..)
    dn.add(..)
    ...    
}); 
```

### Tensor

A tensor is a scalar or a vector or a multidimensional array. it can be created using dn.tensor(..)

```js
deepnet.platforms.cpu().then((dn) => {
    
    let dense = dn.tensor([1, 2, 3, 4], [2, 2], is_sparse = false);    
    dense.print();

    let sparse = dn.tensor([1, 2, 0, 4, 5, 6, 0, 0], [2, 2, 2], is_sparse = true);    
    sparse.print();

});
```

__Contains:__

* __value__ Initial value for the tensor.
    
    * __data__ Array of numbers.

    * __shape__ The shape of the tensor. if it is not defined, it will be automatically found from data.    

* __grad__ Stores the derivation of the tensor, it will be filled while backpass().

    * __data__ Array of numbers.

    * __shape__ The shape of the grad. if it is not defined, it will be automatically found from data.

* __parents__ Stores the Parents (vertex[]), from which it is created.

* __print()__ prints the tensor.

* __feed()__ Recalculates the values respectively, it will fills the value.

* __back()__ Calculates the derivation, it will fills the grad.

* __is_sparse__ it is used specify whether the tensor to be created is sparse or dense. default false.

### Vertex

> :warning: **dn.vertex(..) is deprecated.** Use dn.tensor(..) directly. 


### Operations

#### Broadcasting

deepnet.js supports broadcasting, no copy or temporary variables are created.

#### basic_operation

```js
deepnet.platforms.cpu().then((dn) => {
    
    // supports broadcasting
    const a = dn.ones([2, 2, 2]);
    const b = dn.zeros([2, 2]);
        
    const res = dn.add(a, b);
    // dn.sub(..), dn.mul(..), dn.div(..) 

    res.print();
    
})
```

Output:
```
Tensor
[[[1 1]
  [1 1]]

 [[1 1]
  [1 1]]]
```

#### Matmul_two_Tensors

```js
deepnet.platforms.cpu().then((dn) => {
    
    // supports broadcasting
    const a = dn.ones([2, 2, 2]);
    const b = dn.ones([2, 2]);
        
    const res = dn.matmul(a, b);
    res.print();
    
})
```

Output:
```
Tensor
[[[2 2]
  [2 2]]

 [[2 2]
  [2 2]]]
```


### Available_methods

Available methods under the deepnet.platforms.cpu(..)

* tensor
* randn
* ones
* zeros
* fill
* add
* sub
* mul
* div
* transpose
* matmul
* get_output
* grad_zero
* backpass
* sig
* relu
* tanh
* recp

### Backpass_example

__dn.backpass()__

dn.backpass(..tensor..) will Compute the gradients (derivatives) of the current tensor and 
adds the computed gradients with the grad (grad_ is initialized with value (0)).

grad must be zero before calling dn.backpass(). The graph which is constructed while the forword operation is differentiated using chain rule. 

__dn.update_loss()__

> :warning: **dn.update_loss(..) is deprecated.** Use dn.optimizer.SGD(..).step() instead.

__dn.grad_zero()__

dn.grad_zero() will Reset the tensor's grad (it will simple set grad to zero). 
this should be called after dn.optimizer.SGD(..).step().

__dn.detach()__

> :warning: **dn.detach(..) is deprecated.** Automatically detached.

__dn.traversal()__

> :warning: **dn.traversal(..) is deprecated.** Use dn.tensor(..).grad.print() to print specifically.


```js
deepnet.platforms.cpu().then((dn) => {
    
    // supports broadcasting
    const a = dn.ones([1, 2]);
    const w = dn.ones([2, 2]);
    const b = dn.ones([1, 2]);

    const optim = dn.optimizer.SGD([w, b], 0.04);

    const mres = dn.matmul(a, w);
    const result = dn.add(mres, b);
    
    dn.backpass(result);
    optim.step();
    dn.grad_zero(result);

})

```

### fully_connected_example

```js

vanilla_net();

async function vanilla_net(){

    let dn = await deepnet.platforms.cpu();

    let input_tensor = dn.tensor([0, 0, 1, 1, 0, 1, 0, 1, 0, 0], [1, 10]);        
    
    let linear1 = deepnet.nn.Linear(dn, 10, 5);
    let linear2 = deepnet.nn.Linear(dn, 5, 1);
    
    let out1 = linear1(input_tensor);
    let out2 = dn.sig(out1)
    let result = dn.sig(linear2(out2)); 
       
    let optim = dn.optimizer.SGD([linear1.weights, linear1.biases, linear2.weights, linear2.biases], lr = 0.04);

    for (let i = 0; i < 700; i++) {           
        // prime no.
        input_tensor.value.data = [0, 0, 1, 1, 0, 1, 0, 1, 0, 0];
        dn.get_output(result);
        dn.backpass(result, dn.tensor(result.value.data.map((v, i)=>v-1),result.value.shape);
        optim.step();
        dn.grad_zero(result);

        // !prime no.    
        input_tensor.value.data = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1];
        dn.get_output(result);
        dn.backpass(result, dn.tensor(result.value.data.map((v, i)=>v-0), result.value.shape));                
        optim.step();
        dn.grad_zero(result);
    }

    input_tensor.value.data = [0, 0, 1, 1, 0, 1, 0, 1, 0, 0];
    dn.get_output(result);
    result.value.print();
    
    input_tensor.value.data = [1, 1, 0, 0, 1, 0, 1, 0, 1, 1];
    dn.get_output(result);
    result.value.print();

}

```

Output:
```
Tensor
[[0.9287171535850516]]

Tensor
[[0.08015744142447224]]
```