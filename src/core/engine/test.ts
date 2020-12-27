import { Vertex } from "./vertex";
import * as dn from "./_entry_engine";

let a;
// // ceil
// a = dn.vertex(dn.tensor([0.6, 1.1, -3.3]))
// dn.ceil(a).print();
// // [1 2 -3]

// // cos
// a = dn.vertex(dn.tensor([0, Math.PI / 2, Math.PI * 3 / 4]))
// dn.cos(a).print();
// // [1 6.123233995736766e-17 -0.7071067811865475]

// // sin
// a = dn.vertex(dn.tensor([0, Math.PI / 2, Math.PI * 3 / 4]))
// dn.sin(a).print();
// // [0, 1, 0.7071098]

// // tan
// a = dn.vertex(dn.tensor([0, Math.PI / 2, Math.PI * 3 / 4]))
// dn.tan(a).print();
// // [0, -Infinity, -0.9999999]

// // floor
// a = dn.vertex(dn.tensor([0.6, 1.1, -3.3]))
// dn.floor(a).print();
// // [0, 1, -4]

// // neg
// a = dn.vertex(dn.tensor([1, 2, -2, 0], [2, 2]))
// dn.neg(a).print();
// // Tensor
// // [[-1, -2],
// // [2 , 0 ]]

// // recp
// a = dn.vertex(dn.tensor([0, 1, 2]))
// dn.recp(a).print();
// //[Infinity, 1, 0.5]

// // floor
// a = dn.vertex(dn.tensor([0.6, 1.1, -3.3]))
// dn.round(a).print();
// // [1, 1, -3]

// // max
// a = dn.max(dn.vertex(dn.tensor([1, 2, 3, 4])), dn.vertex(dn.tensor([2, 1, 4, 3])));
// a.print();


// // min
// a = dn.min(dn.vertex(dn.tensor([1, 2, 3, 4])), dn.vertex(dn.tensor([2, 1, 4, 3])));
// a.print();




// b test
a = dn.vertex(dn.tensor([0.6, 1.1, -3.3]))
a = dn.ceil(a);
a = dn.cos(a);
a = dn.sin(a)
a = dn.tan(a);
a = dn.floor(a) as Vertex<any>;
// a = dn.neg(a);
// a = dn.recp(a);
// b = dn.neg(b) as Vertex<any>;
a = dn.round(a) as Vertex<any>;

// console.log(a)
dn.backpass(a, dn.fill(a.tensor_.shape, 5));
console.log("result================================")
dn.traversal(a, "tensor_")

console.log("grad================================")
dn.traversal(a, "grad_")