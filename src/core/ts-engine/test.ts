import { backpass, traversal } from "./graph";
import { tensor } from "./tensor";
import { vertex } from "./vertex";

import { add, transpose, multiply, sub, matmul } from "./_entry_engine";
const t1 = new tensor(1);
const t2 = new tensor(2);

const a = new vertex(t1);
const b = new vertex(t2);

const res = matmul(a, b);
res.grad_ = new tensor(res.tensor_.data.map((v, i) => 15), res.tensor_.shape)

backpass(res);
traversal(res);