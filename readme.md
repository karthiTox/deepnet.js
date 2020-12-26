## Deepnet

deepnet is an auto-differentiation library for javascript. it dynamically build a computation graph while doing operations and compute gradients during the backward pass.

## usage

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
<script src="dist/deepnet.esm"></script>
<script>
    
    const a = dn.tensor([1, 2, 3, 4], [2, 2]);
    const b = dn.tensor([1, 2, 3, 4], [2, 2]);

    const result = dn.matmul( a, b );
    result.print();

</script>
```

## Installation

## NPM
```bash
npm install deepnet
```

## CDN
```CDN
links
```

## Autograd

Autograd (Automatic Differentitation) is a method which uses a computational graph to compute a derivatives automatically. In the forward phase, the operations it executed and computational graph is constructed, and in the backward phase, the dervatives are computed automatically.

## tensor

A tensor is a scalar or a vector or a multidimensional array. it can be created using dn.tensor()

```js
const a = dn.tensor([1, 2, 3, 4], [2, 2]);
```

Contains:
* __data__ The values of the tensor. it array of numbers.
    
* __shape__ The shape of the tensor. if it is not defined, it will be automatically found from data.

## Vertex

A vertex is a point on the graph, it holds the tensor and grad (tensor) to calculate the derivatives of the tensor.

```js
const a = dn.vertex(dn.tensor([1, 2, 3, 4], [2, 2]));
```

Contains:
 * __tensor__ Initial value for the tensor.
 * __gad__ Derivatives of this resultant tensor, it will be filled while backpass
 * __parents__ Parents of the resultant vertex, it will be filled when you use the tensor operations.
 * __back__ Calculates derivatives
 * __name__ Name of the vertex.

## Examples
 
Create a tensor

```js
const a = dn.ones([2, 2]);
a.print()
```

Output:
```
Tensor
[[1 1]
 [1 1]]
```

Adding two tensor

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

