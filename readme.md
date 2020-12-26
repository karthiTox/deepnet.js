## deepnet.js

<img src="logo.png" width="200" height="200" />

deepnet is an auto-differentiation library for javascript. it will dynamically build a computational graph while doing math operations and compute gradients during the backward pass.

## Installation

## NPM

```bash
npm install deepnet.js
```

## CDN

```CDN
https://unpkg.com/deepnet.js@1.0.2/dist/deepnet-browser.min.js
https://unpkg.com/deepnet.js@1.0.2/dist/deepnet-browser.js
```

## Usage

## Node

```js
const dn = require("deepnet");

const a = dn.tensor([1, 2, 3, 4], [2, 2]);
const b = dn.tensor([1, 2, 3, 4], [2, 2]);

const result = dn.matmul( a, b );
result.print();
```

## CDN

```html
<script src="https://unpkg.com/deepnet.js@1.0.2/dist/deepnet-browser.js"></script>
<script>
    let dn = deepnet;

    const a = dn.tensor([1, 2, 3, 4], [2, 2]);
    const b = dn.tensor([1, 2, 3, 4], [2, 2]);

    const result = dn.matmul( a, b );
    result.print();

</script>
```

## Autograd

Autograd (Automatic Differentitation) is a method which uses a computational graph to compute a derivatives automatically. In the forward phase, it executes the math operation and constructs the computational graph, and In the backward phase, the dervatives are computed automatically.

## tensor

A tensor is a scalar or a vector or a multidimensional array. it can be created using dn.tensor()

```js
const a = dn.tensor([1, 2, 3, 4], [2, 2]);
```

__Contains:__
* __data__ The values of the tensor. it array of numbers.

* __shape__ The shape of the tensor. if it is not defined, it will be automatically found from data.

## Vertex

A vertex is a point on the graph, it holds the tensor and grad (tensor) to calculate the derivatives of the tensor and it is used to construct a graph.

```js
const a = dn.vertex(dn.tensor([1, 2, 3, 4], [2, 2]));
```

__Contains:__
 * __tensor__ Initial value for the tensor.

 * __grad__ derivative of the tensor, it will be filled while backpass.

 * __parents__ Parents of the resultant vertex, it will be filled when you do any tensor operations.

 * __back__ Calculates derivatives, fills grad

 * __name__ Name of the vertex.

## Examples
 
__Creating a tensor__

```js
const a = dn.ones([2, 2]);
a.print();
```

Output:
```
Tensor
[[1 1]
 [1 1]]
```

__Adding two tensors__

```js
const a = dn.ones([2, 2]);
const b = dn.ones([2, 2]);
const result = dn.add(a, b);
result.print();
```

Output:
```
Tensor
[[2 2]
 [2 2]]
```

__Creating a vertex__

```js
const a = dn.vertex(dn.fill([2, 2], 5));
a.print();
```
```js
a.print() == a.tensor_.print();
```

Output:
```
Tensor
[[5 5]
 [5 5]]
```

__Multiplying two vertices__

```js
const a = dn.vertex(dn.fill([2, 2], 5));
const b = dn.vertex(dn.fill([2, 2], 2));

const result = dn.multiply(a, b);
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

dn.backpass() will Compute the gradient (derivatives) of the current vertex's tensor (tensor_) and 
adds the results with grad (grad is initialized with value (0)).

<<<<<<< HEAD
grad must be zero before calling dn.backpass(). The graph which is constructed while the forword operation and then it is differentiated using chain rule. 

__dn.update_loss()__

dn.update_loss() will update the vertex's tensor with grad (it simple subtracts vertex's tensor from vertex's grad).
this should be called after backpass.


__dn.grad_zero()__

dn.grad_zero() will Reset the grad (it simple set grad to zero). 
this should be called after update_loss.

__dn.detach()__

dn.detach() will detach the graph. this should be called at end.

__dn.traversal()__

dn.traversal() method will visits each vertex of the graph and prints the vertex's tensor or grad.
by default, it will print vertex's tensor.

```js

const a = dn.vertex(dn.fill([2, 2], 5));
const w = dn.vertex(dn.fill([2, 2], 2));

const b = dn.vertex(dn.fill([2, 2], 2));

const matmul_result = dn.matmul(a, w);
const result = dn.add(matmul_result, b);

dn.backpass(result, dn.ones(result.tensor_.shape));
dn.traversal(result, "grad_");

```

Output: ( prints each vertex's grad )
```
result
Tensor
[[1 1]
 [1 1]]

matmul_result
Tensor
[[1 1]
 [1 1]]

a
Tensor
[[4 4]
 [4 4]]

w
Tensor
[[10 10]
 [10 10]]

b
Tensor
[[1 1]
 [1 1]]
```

## fully connected example

```js
function sig(z) {
    return 1.0 / ( 1.0 + Math.exp(-z) );
}

function sigPrime(z) {
    return (1.0 / ( 1.0 + Math.exp(-z) )) * (1 - (1.0 / ( 1.0 + Math.exp(-z) )));
}

function fully_connected(input, weights, biases){
    let res1 = dn.matmul(input, dn.transpose(weights));                
    let res2 = dn.add(res1, biases);
    let res = dn.applyfn(res2, sig, sigPrime);

    return res;
}  

function loss(a, y){
    return dn.sub(a, y);
}


let w = dn.vertex(dn.rand([5, 2]));
let b = dn.vertex(dn.rand([1, 5]));

for (let iteration = 0; iteration < 1000; iteration++) {
    
    let a = dn.vertex(dn.ones([1, 2]));  
    let result = fully_connected(a, w, b);
    let output = dn.tensor([0, 1, 0, 1, 0], [1, 5]);
    
    dn.backpass(result, loss(result.tensor_, output));
    dn.update_loss(result, 0.04);
    dn.grad_zero(result);
    dn.detach(result);

}

let prediction = fully_connected(dn.ones([1, 2]), w.tensor_, b.tensor_);
prediction.print();
```

Output:
```
Tensor
[[0.08015744142447224 0.9287171535850516 0.07756408786218669 0.9350647521435035 0.07852084424767934]]
```