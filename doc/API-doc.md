# deepnet.js API-doc
deepnet.js is an auto-differentiation library for javascript. it will compute the gradients in both static and dynamic method.

## Basic

deepnet.platforms.cpu() returns a promise which resolves and returns a class (cpu) which contains all the methods to perform the tensor operations
*
```js
const deepnet = require("deepnet.js");
*
deepnet.platforms.cpu().then((dn) => {
*
dn.tensor(..)
dn.add(..)
...
*
});
```

## tensor - method

A tensor is a scalar or a vector or a multidimensional array.


### param
__array__  { array } Initial value for the tensor Array of numbers

__shape__  { array } The shape of the tensor if it is not defined it will be automatically found from data

__is_sparse__  { boolean } it is used specify whether the tensor to be created is sparse or dense default false

```js
let dense = dn.tensor([1, 2, 3, 4], [2, 2], is_sparse = false);
dense.print();

let sparse = dn.tensor([1, 2, 0, 4, 5, 6, 0, 0], [2, 2, 2], is_sparse = true);
sparse.print();
```
*
## randn - method

It creates a tensor filled with random numbers from a given shape.
A tensor is a scalar or a vector or a multidimensional array.


### param
__shape__  { array } The shape of the tensor if it is not defined it will be automatically found from data

__is_sparse__  { boolean } it is used specify whether the tensor to be created is sparse or dense default false

```js
let a = dn.randn([2, 2], is_sparse = false);
a.print();
```

## ones - method

It creates a tensor filled with ones from a given shape.
A tensor is a scalar or a vector or a multidimensional array.


### param
__shape__  { array } The shape of the tensor if it is not defined it will be automatically found from data

__is_sparse__  { boolean } it is used specify whether the tensor to be created is sparse or dense default false

```js
let a = dn.ones([2, 2], is_sparse = false);
a.print();
```

## zeros - method


It creates a tensor filled with zeros from a given shape.
A tensor is a scalar or a vector or a multidimensional array.
*

### param
__shape__  { array } The shape of the tensor if it is not defined it will be automatically found from data

__is_sparse__  { boolean } it is used specify whether the tensor to be created is sparse or dense default false

```js
let a = dn.zeros([2, 2], is_sparse = false);
a.print();
```

## fill - method

It creates a tensor filled with a given value.
A tensor is a scalar or a vector or a multidimensional array.


### param
__shape__  { array } The shape of the tensor if it is not defined it will be automatically found from data

__value__  { number } The value to be filled

__is_sparse__  { boolean } it is used specify whether the tensor to be created is sparse or dense default false

```js
let a = dn.fill([2, 2], 5, is_sparse = false);
a.print();
```
## add - method

Adds two Tensors element-wise, Supports broadcasting and sparse.


### param
__a__  { Tensor } The first Tensor

__b__  { Tensor } The second Tensor

```js
let a = dn.fill([2, 2], 5, is_sparse = false);
let b = dn.fill([2, 2], 4, is_sparse = false);

let result = dn.add(a, b);
*
result.print();
```
## sub - method

Subtracts two Tensors element-wise, Supports broadcasting and sparse.


### param
__a__  { Tensor } The first Tensor

__b__  { Tensor } The second Tensor

```js
let a = dn.fill([2, 2], 5, is_sparse = false);
let b = dn.fill([2, 2], 4, is_sparse = false);

let result = dn.sub(a, b);
*
result.print();
```
## mul - method

Multiplies two Tensors element-wise, Supports broadcasting and sparse.


### param
__a__  { Tensor } The first Tensor

__b__  { Tensor } The second Tensor

```js
let a = dn.fill([2, 2], 5, is_sparse = false);
let b = dn.fill([2, 2], 4, is_sparse = false);

let result = dn.mul(a, b);
*
result.print();
```
## div - method

Divides two Tensors element-wise, Supports broadcasting and sparse.


### param
__a__  { Tensor } The first Tensor

__b__  { Tensor } The second Tensor

```js
let a = dn.fill([2, 2], 5, is_sparse = false);
let b = dn.fill([2, 2], 4, is_sparse = false);

let result = dn.div(a, b);
*
result.print();
```
## recp - method

Computes reciprocal of the tensor.

### param
__a__  { Tensor } The tensor to apply a function

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let result = dn.recp(a);
result.print();
```
## split - method

this method splits the tensor according to the ratio and then returns an array of tensors.
eg:

a => tensor{[1, 2, 3, 4], shape [4]}
*
ratio => [x1/4, x2/4, ...]
*

### parama The tensor to split
axis The Axis at which the tensor split
ratio Ratio of each splits

```js
let a = dn.tensor(
[
[1, 2, 3, 4],
[5, 6, 7, 8],
]);
let result = dn.split(a, 1, [2/4, 2/4]);
result.forEach(r => r.print());
```
## concat - method

this method concats two or more tensor.


### parama The tensor to split
axis The Axis at which the tensor split
ratio Ratio of each splits

```js
let a = dn.tensor(
[
[1, 2, 3, 4],
[5, 6, 7, 8],
]);
let b = dn.tensor(
[
[1, 2],
[5, 6],
]);
let result = dn.concat([a, b], 1);
result.print();
```
## transpose - method

Transposes the Tensor.
shift the axis according to the given dimension


### param
__a__  { Tensor } The Tensor to Transpose

__dimension__  { number_array } dimension to shift

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let result = dn.transpose(a, [1, 0]);

result.print();
```
## matmul - method

Computes the matrix multipication of two tensors.


### param
__a__  { Tensor } The first Tensor

__b__  { Tensor } The second Tensor

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let b = dn.tensor([1, 2, 3, 4], [2, 2]);

let result = dn.matmul(a, b);
*
result.print();
```
## backpass - method

This will Compute the gradient (derivatives) of the current vertex's tensor (tensor_) and
adds the results with grad_ (grad_ is initialized with value (0)).

grad_ must be zero before calling it.
*
The graph which is constructed while the forword operation is differentiated using chain rule.
*

### param
__s__  { Tensor } Resultant vertex or Starting vertex

__initial_grad__  { Tensor } Initial grad or derivative to start with

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let w = dn.randn([2, 2]);
let result = dn.mul(a, w)

dn.backpass(result); // <<<
```
## grad_zero - method

This will Reset the grad (grad_).
this should be called after update_loss.


### param
__s__  { Tensor } Resultant vertex or Starting vertex

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let w = dn.randn([2, 2]);
let result = dn.mul(a, w)

dn.backpass(result);
dn.grad_zero(result); // <<< used after backpass
```
## get_output - method

This will recalculate the forword propogation.


### params Resultant vertex or Starting vertex

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let w = dn.randn([2, 2]);
let result = dn.mul(a, w)

dn.backpass(result);
dn.get_output(result) // <<< this will recalculate
```
## Activations

## sig - method

Computes sigmoid activation element-wise

### param
__a__  { Tensor } The tensor to apply a function

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let result = dn.sig(a);
result.print();
```
## relu - method

Computes Relu activation element-wise

### param
__a__  { Tensor } The tensor to apply a function

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let result = dn.relu(a);
result.print();
```
## tanh - method

Computes tanh activation element-wise

### param
__a__  { Tensor } The tensor to apply a function

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let result = dn.tanh(a);
result.print();
```
## SGD
Constructs an Optimizer that uses (SGD) stochastic gradient descent. 

### param
__parameters__  { Tensor_array } Paremeters to update

__lr__  { number } The learning rate for the SGD

```js
let a = dn.tensor([1, 2, 3, 4], [2, 2]);
let w = dn.randn([2, 2]);
let b = dn.randn([2, 2]);
let optm = dn.optimizer.SGD([w, b], 0.04); //<<
let result = dn.add(dn.matmul(a, w), b)
let loss = dn.sub(result, dn.tensor([0, 1, 0, 1], [2, 2])); 
dn.backpass(result, loss);
optm.step(); //<<
dn.grad_zero(result);
```
