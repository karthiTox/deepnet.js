## deepnet.js

<img src="logo.png" width="200" height="200" />

deepnet.js is an auto-differentiation library for javascript. it will compute the gradients in both static and dynamic method.

> :warning: **Deepnet.js** is reimplemented from ground to support sparse tensor, broadcast
> and also various backends are in development, If you are using the older versions 1.0.2 or below, 
> please upgrade your code accordingly.

## Installation

## NPM

```bash
npm install deepnet.js
```

## CDN

```CDN
https://unpkg.com/deepnet.js@latest/dist/deepnet-browser.min.js
https://unpkg.com/deepnet.js@latest/dist/deepnet-browser.js
```

## Usage

## Node

```js
const deepnet = require("deepnet.js");

deepnet.backends.cpu().then((backend) => {
    
    let dn = backend;

    const a = dn.tensor([1, 2, 3, 4], [2, 2]);
    const b = dn.tensor([1, 2, 3, 4], [2, 2]);
    
    const result = dn.matmul( a, b );
    result.print();

})
```

## CDN

```html
<script src="https://unpkg.com/deepnet.js@latest/dist/deepnet-browser.min.js"></script>
<script>

    deepnet.backends.cpu().then((backend) => {
    
        let dn = backend;

        const a = dn.tensor([1, 2, 3, 4], [2, 2]);
        const b = dn.tensor([1, 2, 3, 4], [2, 2]);

        const result = dn.matmul( a, b );
        result.print();

    })

</script>
```

## Autodiff

Autodiff (Automatic Differentitation) is a technique which uses a computational graph to compute a derivatives automatically. 

In the forward phase, it executes the math operation and constructs the computational graph, and In the backward phase, the dervatives are computed automatically.

## tensor

A tensor is a scalar or a vector or a multidimensional array. it can be created using dn.tensor(..)

```js
const a = dn.tensor([1, 2, 3, 4], [2, 2], is_sparse = false);
```

__Contains:__
* __data__ The values of the tensor. Array of numbers.

* __shape__ The shape of the tensor. if it is not defined, it will be automatically found from data.

* __is_sparse__ it is used specify whether the tensor to be created is sparse or dense. default false.

## Vertex

> :warning: **dn.vertex(..) is deprecated.** Use dn.tensor(..) directly. 

## Examples
 
__Creating a tensor__

```js
deepnet.backends.cpu().then((dn) => {
    
    const a = dn.ones([2, 2]);
    const b = dn.zeros([2, 2], is_sparse = true);
    
    a.print();
    b.print();

})
```

Output:
```
Tensor
[[1 1]
 [1 1]]
```

__Basic tensor operations__

add, sub, mul, div, matmul - supports broadcast

```js
deepnet.backends.cpu().then((dn) => {
    
    // supports broadcasting
    const a = dn.ones([2, 2, 2]);
    const b = dn.zeros([2, 2], is_sparse = true);
    
    const res = dn.add(a, b);

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

__Multiplying two vertices__

```js
const a = dn.vertex(dn.fill([2, 2], 5));
const b = dn.vertex(dn.fill([2, 2], 2));

const result = dn.mul(a, b);
result.print();
```

Output:
```
Tensor
[[10 10]
 [10 10]]
```

__Backpass example__

__dn.backpass()__

dn.backpass() will Compute the gradients (derivatives) of the current tensor and 
adds the computed gradients with the grad (grad_ is initialized with value (0)).

grad must be zero before calling dn.backpass(). The graph which is constructed while the forword operation is differentiated using chain rule. 

__dn.update_loss()__

dn.update_loss() will update the tensor's value with grad (it with simple subtracts the tensor's value from tensor's grad).
this should be called after backpass.


__dn.grad_zero()__

dn.grad_zero() will Reset the tensor's grad (it will simple set grad to zero). 
this should be called after update_loss.

__dn.detach()__

dn.detach() will detach the graph. this should be called at end.

__dn.traversal()__

> :warning: **dn.traversal(..) is deprecated.** Use dn.tensor(..).grad.print() to print specifically.

```js

const a = dn.fill([2, 2], 5);
const w = dn.fill([2, 2], 2);

const b = dn.fill([2, 2], 2);

const matmul_result = dn.matmul(a, w);
const result = dn.add(matmul_result, b);

dn.backpass(result);
w.grad.print();
b.grad.print();

```

Output: ( prints each tensor's grad )
```
Tensor
[[10 10]
 [10 10]]

Tensor
[[1 1]
 [1 1]]
```

## fully connected example

```js

vanilla_net();

async function vanilla_net(){

    let dn = await deepnet.backends.cpu();

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