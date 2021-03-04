# deepnet.js

![unit test](https://github.com/karthitox/deepnet.js/actions/workflows/test.yml/badge.svg)
![npm](https://github.com/karthitox/deepnet.js/actions/workflows/publish.yml/badge.svg)

<img src="logo.png" width=250 heigth=250 />

__deepnet.js__ is an auto-differentiation library for javascript. it will compute the gradients in both static and dynamic method.

> you can see the API-doc <a href="https://github.com/karthiTox/deepnet.js/tree/master/doc/API-doc.md">here.</a>

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
---
## Support 🔥

If this package helps you, please consider supporting me. Your donation will inspire me to work on this project.

<a href="https://www.paypal.com/paypalme/karthitox">paypal.me</a>

Thanks for considering to donate.

---

## Getting started

## Full API-doc

you can see the API-doc <a href="https://github.com/karthiTox/deepnet.js/tree/master/doc/API-doc.md">here.</a>

### Table of Contents

* [Autodiff](#Autodiff)
* [Platforms/Backends](#PlatformsBackends)
* [Tensor](#Tensor)
* [Operations](#Operations)
    * [Broadcasting](#Broadcasting)
    * [basic operations](#basic_operation)
    * [Matmul two Tensors](#Matmul_two_Tensors)
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


### fully_connected_example

```js
const deepnet = require("deepnet.js");

(async () => {  

    // importing the "cpu" class
    let dn = await deepnet.platforms.cpu();

    // declaring input
    let a = dn.tensor([1, 2, 3, 4], [2, 2]);

    // declaring weights
    let w = dn.randn([2, 2]);
    let b = dn.randn([2, 2]);

    // single nn layer - (linear layer)
    // returns sigmoid( a @ w + b )
    const feed = (a, w, b) => {
        let mat_res = dn.matmul(a, w);
        let added = dn.add(mat_res, b);
        return dn.sig(added);
    }

    // Stochastic gradient descent optimizer
    let optm = dn.optimizer.SGD([w, b], 0.04);
    
    for (let i = 0; i < 300; i++) {
        
        let result = feed(a, w, b);
        let loss = dn.sub(result, dn.tensor([0, 1, 0, 1], [2, 2]));              
        
        dn.backpass(result, loss); // calculating derivatives
        optm.step(); // updating weights
        dn.grad_zero(result); // reseting the grad

    }

    // Predicting the values
    let pred = feed(a, w, b);
    pred.print();

})();

```

Output:
```
Tensor
[[0.08579222069069875 0.905562796140377]
 [0.005928221665889459 0.9933268076751989]]
```