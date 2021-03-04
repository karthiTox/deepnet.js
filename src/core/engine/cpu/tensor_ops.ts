import { nArray } from "./Array";
import { ops, util } from "./array_ops";
import * as rand_gen from "../util/random";

export let tensor_count = 0;

export class Tensor<m_arr> {
  static tensor_count = 0;

  public id = Tensor.tensor_count;
  public value: nArray<m_arr>;
  public grad: nArray<m_arr>;
  public parents: (Tensor<m_arr> | null)[];
  public feed() {}
  public back() {}

  constructor(
    array: m_arr,
    shape?: number[] | null,
    is_sparse: boolean = false
  ) {
    this.value = new nArray(array, shape, is_sparse);
    this.grad = new nArray(
      new Array(this.value.data.length).fill(0),
      Array.from(this.value.shape),
      is_sparse
    );
    this.parents = [];
    Tensor.tensor_count += 1;
  }

  public print() {
    this.value.print();
  }
}

/**
 * # deepnet.js API-doc
 * deepnet.js is an auto-differentiation library for javascript. it will compute the gradients in both static and dynamic method.
 */

/**
 * ## Basic
 *
 * deepnet.platforms.cpu() returns a promise which resolves and returns a class (cpu) which contains all the methods to perform the tensor operations
 *
 * ```js
 * const deepnet  = require("deepnet.js");
 *
 * deepnet.platforms.cpu().then((dn) => {
 *
 *  dn.tensor(..)
 *  dn.add(..)
 *  ...
 *
 * });
 * ```
 */

export class ops_cpu {
  public Tensor_type = Tensor;

  /**
   * A tensor is a scalar or a vector or a multidimensional array.
   *
   * @param {array} array Initial value for the tensor, Array of numbers.
   * @param {array} shape The shape of the tensor. if it is not defined, it will be automatically found from data
   * @param {boolean} is_sparse it is used specify whether the tensor to be created is sparse or dense. default false.
   *
   *
   *  ```js
   * let dense = dn.tensor([1, 2, 3, 4], [2, 2], is_sparse = false);
   * dense.print();
   *
   * let sparse = dn.tensor([1, 2, 0, 4, 5, 6, 0, 0], [2, 2, 2], is_sparse = true);
   * sparse.print();
   * ```
   *
   */
  tensor<arr>(array: arr, shape?: number[] | null, is_sparse: boolean = false) {
    return new Tensor(array, shape, is_sparse);
  }

  is_tensor<a>(t: any): t is Tensor<a> {
    return <Tensor<a>>t.value !== undefined;
  }

  private find_tot(shape: number[]): number {
    let tot = shape.reduce((a, b) => a * b);
    return tot;
  }

  /**
   * It creates a tensor filled with random numbers from a given shape.
   * A tensor is a scalar or a vector or a multidimensional array.
   *
   * @param {array} shape The shape of the tensor. if it is not defined, it will be automatically found from data
   * @param {boolean} is_sparse it is used specify whether the tensor to be created is sparse or dense. default false.
   *
   *
   *  ```js
   * let a = dn.randn([2, 2], is_sparse = false);
   * a.print();
   * ```
   *
   */
  randn(shape: number[], is_sparse: boolean = false) {
    let tot = this.find_tot(shape);
    let res = [];
    for (let r = 0; r < tot; r++) {
      res.push(rand_gen.randn(0, 0.4));
    }
    return this.tensor(res, shape, is_sparse);
  }

  /**
   * It creates a tensor filled with ones from a given shape.
   * A tensor is a scalar or a vector or a multidimensional array.
   *
   * @param {array} shape The shape of the tensor. if it is not defined, it will be automatically found from data
   * @param {boolean} is_sparse it is used specify whether the tensor to be created is sparse or dense. default false.
   *
   *
   *  ```js
   * let a = dn.ones([2, 2], is_sparse = false);
   * a.print();
   * ```
   *
   */
  ones(shape: number[], is_sparse: boolean = false) {
    let tot = this.find_tot(shape);
    return this.tensor(new Array(tot).fill(1), shape, is_sparse);
  }

  /**
   *
   * It creates a tensor filled with zeros from a given shape.
   * A tensor is a scalar or a vector or a multidimensional array.
   *
   * @param {array} shape The shape of the tensor. if it is not defined, it will be automatically found from data
   * @param {boolean} is_sparse it is used specify whether the tensor to be created is sparse or dense. default false.
   *
   *
   *  ```js
   * let a = dn.zeros([2, 2], is_sparse = false);
   * a.print();
   * ```
   *
   */
  zeros(shape: number[], is_sparse: boolean = false) {
    if (!is_sparse) {
      let tot = this.find_tot(shape);
      return this.tensor(new Array(tot).fill(0), shape, is_sparse);
    } else {
      return this.tensor([], shape, is_sparse);
    }
  }

  /**
   * It creates a tensor filled with a given value.
   * A tensor is a scalar or a vector or a multidimensional array.
   *
   * @param {array} shape The shape of the tensor. if it is not defined, it will be automatically found from data
   * @param {number} value The value to be filled
   * @param {boolean} is_sparse it is used specify whether the tensor to be created is sparse or dense. default false.
   *
   *
   *  ```js
   * let a = dn.fill([2, 2], 5, is_sparse = false);
   * a.print();
   * ```
   */
  fill(shape: number[], value: number, is_sparse: boolean = false) {
    let tot = this.find_tot(shape);
    return this.tensor(new Array(tot).fill(value), shape, is_sparse);
  }

  /**
   * Adds two Tensors element-wise, Supports broadcasting and sparse.
   *
   * @param {Tensor} a The first Tensor
   * @param {Tensor} b The second Tensor
   *
   * ```js
   * let a = dn.fill([2, 2], 5, is_sparse = false);
   * let b = dn.fill([2, 2], 4, is_sparse = false);
   *
   * let result = dn.add(a, b);
   *
   * result.print();
   * ```
   */
  add<arr>(a: Tensor<arr>, b: Tensor<arr>) {
    let res = new Tensor(
      new Array(a.value.data.length).fill(0),
      a.value.shape,
      a.value.is_sparse
    );

    res.parents = [a, b];

    res.feed = () => {
      for (let v = 0; v < res.value.data.length; v++) {
        res.value.data[v] = 0;
      }

      ops.basic(a.value, b.value, res.value, ops.basic_types.add);
    };

    res.feed();

    res.back = () => {
      let grada = ops.unbroadcast(res.grad, a.value.shape);
      let gradb = ops.unbroadcast(res.grad, b.value.shape);

      ops.basic(grada, a.grad, a.grad, ops.basic_types.add);
      ops.basic(gradb, b.grad, b.grad, ops.basic_types.add);
    };

    return res;
  }

  /**
   * Subtracts two Tensors element-wise, Supports broadcasting and sparse.
   *
   * @param {Tensor} a The first Tensor
   * @param {Tensor} b The second Tensor
   *
   * ```js
   * let a = dn.fill([2, 2], 5, is_sparse = false);
   * let b = dn.fill([2, 2], 4, is_sparse = false);
   *
   * let result = dn.sub(a, b);
   *
   * result.print();
   * ```
   */
  sub<arr>(a: Tensor<arr>, b: Tensor<arr>) {
    let res = new Tensor(
      new Array(a.value.data.length).fill(0),
      a.value.shape,
      a.value.is_sparse
    );

    res.parents = [a, b];

    res.feed = () => {
      for (let v = 0; v < res.value.data.length; v++) {
        res.value.data[v] = 0;
      }
      ops.basic(a.value, b.value, res.value, ops.basic_types.sub);
    };

    res.feed();

    res.back = () => {
      let grada = ops.unbroadcast(res.grad, a.value.shape);
      let gradb = ops.unbroadcast(res.grad, b.value.shape);

      ops.basic(grada, a.grad, a.grad, ops.basic_types.add);
      ops.basic(gradb, b.grad, b.grad, ops.basic_types.add);
      b.grad.data.map((v) => v * -1);
    };

    return res;
  }

  /**
   * Multiplies two Tensors element-wise, Supports broadcasting and sparse.
   *
   * @param {Tensor} a The first Tensor
   * @param {Tensor} b The second Tensor
   *
   * ```js
   * let a = dn.fill([2, 2], 5, is_sparse = false);
   * let b = dn.fill([2, 2], 4, is_sparse = false);
   *
   * let result = dn.mul(a, b);
   *
   * result.print();
   * ```
   */
  mul<arr>(a: Tensor<arr>, b: Tensor<arr>) {
    let res = new Tensor(
      new Array(a.value.data.length).fill(0),
      a.value.shape,
      a.value.is_sparse
    );

    res.parents = [a, b];

    res.feed = () => {
      for (let v = 0; v < res.value.data.length; v++) {
        res.value.data[v] = 0;
      }
      ops.basic(a.value, b.value, res.value, ops.basic_types.mul);
    };

    res.feed();

    res.back = () => {
      let gradA = ops.unbroadcast(res.grad, a.value.shape);
      let gradB = ops.unbroadcast(res.grad, b.value.shape);

      let gradb = new nArray(
        new Array(a.grad.data.length).fill(0),
        a.grad.shape,
        a.grad.is_sparse
      );
      ops.basic(gradA, a.value, gradb, ops.basic_types.mul);
      ops.basic(gradb, b.grad, b.grad, ops.basic_types.add);

      let grada = new nArray(
        new Array(a.grad.data.length).fill(0),
        a.grad.shape,
        a.grad.is_sparse
      );
      ops.basic(gradB, b.value, grada, ops.basic_types.mul);
      ops.basic(grada, a.grad, a.grad, ops.basic_types.add);
    };

    return res;
  }

  /**
   * Divides  two Tensors element-wise, Supports broadcasting and sparse.
   *
   * @param {Tensor} a The first Tensor
   * @param {Tensor} b The second Tensor
   *
   * ```js
   * let a = dn.fill([2, 2], 5, is_sparse = false);
   * let b = dn.fill([2, 2], 4, is_sparse = false);
   *
   * let result = dn.div(a, b);
   *
   * result.print();
   * ```
   */
  div<arr>(a: Tensor<arr>, b: Tensor<arr>) {
    let bi = this.recp(b);
    return this.mul(a, bi);
  }

  /**
   * Computes reciprocal of the tensor.
   * @param {Tensor} a The tensor to apply a function.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let result = dn.recp(a);
   * result.print();
   * ```
   */
  recp<arr>(a: Tensor<arr>) {
    return this.applyfn(
      a,
      (z: number) => {
        return 1 / z;
      },
      (z: number) => {
        return -1 / (z * z);
      }
    );
  }

  private shift_values<arr>(a: Tensor<arr>, axis = 0, start = true) {
    let res = new Tensor(
      new Array(a.value.data.length).fill(0),
      a.value.shape,
      a.value.is_sparse
    );

    res.feed = () => {
      ops.shift_values(a.value, res.value, axis, start);
    };

    res.feed();

    res.back = () => {
      ops.shift_values(res.grad, a.grad, axis, !start);
    };

    return res;
  }

  /**
   * this method splits the tensor according to the ratio and then returns an array of tensors.
   * eg:
   *
   * a => tensor{[1, 2, 3, 4], shape [4]}
   *
   * ratio => [x1/4, x2/4, ...]
   *
   * @param a The tensor to split
   * @param axis The Axis at which the tensor split.
   * @param ratio Ratio of each splits
   *
   * ```js
   * let a = dn.tensor(
   * [
   * [1, 2, 3, 4],
   * [5, 6, 7, 8],
   * ]);
   * let result = dn.split(a, 1, [2/4, 2/4]);
   * result.forEach(r => r.print());
   * ```
   */
  split<arr>(a: Tensor<arr>, axis: number, ratio: number[]) {
    let res: Tensor<arr>[] = [];
    for (let i = 0; i < ratio.length; i++) {
      const shape = Array.from(a.value.shape);
      shape[axis] *= ratio[i];
      shape[axis] = Math.floor(shape[axis]);

      const tot = shape.reduce((a, b) => a * b);

      res[i] = new Tensor(new Array(tot).fill(0), shape, a.value.is_sparse);
    }

    res[0].parents = [a, null];

    res[0].feed = () => {
      ops.split(
        a.value,
        res.map((r) => r.value),
        axis,
        ratio,
        true
      );
    };

    res[0].feed();

    res[0].back = () => {
      ops.concat(
        res.map((r) => r.grad),
        a.grad,
        axis,
        false
      );
    };

    return res;
  }

  /**
   * this method concats two or more tensor.
   *
   * @param a The tensor to split
   * @param axis The Axis at which the tensor split.
   * @param ratio Ratio of each splits
   *
   * ```js
   * let a = dn.tensor(
   * [
   * [1, 2, 3, 4],
   * [5, 6, 7, 8],
   * ]);
   * let b = dn.tensor(
   * [
   * [1, 2],
   * [5, 6],
   * ]);
   * let result = dn.concat([a, b], 1);
   * result.print();
   * ```
   */
  concat<arr>(a: Tensor<arr>[], axis: number) {
    const shape = Array.from(a[0].value.shape);
    for (let i = 1; i < a.length; i++) {
      shape[axis] += a[i].value.shape[axis];
    }
    let res = new Tensor(
      new Array(shape.reduce((a, b) => a * b)).fill(0),
      shape
    );

    res.parents = [...a];

    res.feed = () => {
      ops.concat(
        a.map((r) => r.value),
        res.value,
        axis,
        true
      );
    };

    res.feed();

    const tot = res.value.shape[axis];
    const ratio = new Array(a.length)
      .fill(0)
      .map((r, i) => a[i].value.shape[axis] / tot);
    res.back = () => {
      ops.split(
        res.grad,
        a.map((r) => r.grad),
        axis,
        ratio
      );
    };

    return res;
  }

  /**
   * Transposes the Tensor.
   * shift the axis according to the given dimension
   *
   * @param {Tensor} a The Tensor to Transpose
   * @param {number_array} dimension dimension to shift
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let result = dn.transpose(a, [1, 0]);
   *
   * result.print();
   * ```
   */
  transpose<arr>(a: Tensor<arr>, dimension?: number[]) {
    let dim = dimension
      ? dimension
      : a.value.shape.map((v, i) => a.value.shape.length - 1 - i);

    let res = new Tensor(
      new Array(a.value.data.length).fill(0),
      util.cal_step_change(a.value.shape, dim),
      a.value.is_sparse
    );

    res.parents = [a, null];

    res.feed = () => {
      for (let v = 0; v < res.value.data.length; v++) {
        res.value.data[v] = 0;
      }

      ops.transpose(a.value, res.value, dim);
    };

    res.feed();

    res.back = () => {
      let grad = new nArray(
        new Array(a.grad.data.length).fill(0),
        a.grad.shape,
        a.grad.is_sparse
      );
      ops.transpose(res.grad, grad, dim);

      ops.basic(grad, a.grad, a.grad, ops.basic_types.add);
    };

    return res;
  }

  /**
   * Computes the matrix multipication of two tensors.
   *
   * @param {Tensor} a The first Tensor
   * @param {Tensor} b The second Tensor
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let b = dn.tensor([1, 2, 3, 4], [2, 2]);
   *
   * let result = dn.matmul(a, b);
   *
   * result.print();
   * ```
   */
  matmul<arr>(a: Tensor<arr>, b: Tensor<arr>) {
    let res_size = 1;
    let res_shape = [];
    for (let i = 0; i < a.value.shape.length - 1; i++) {
      res_size *= a.value.shape[i];
      res_shape[i] = a.value.shape[i];
    }
    res_size *= b.value.shape[b.value.shape.length - 1];
    res_shape[b.value.shape.length - 1] =
      b.value.shape[b.value.shape.length - 1];

    let res = new Tensor(
      new Array(res_size).fill(0),
      res_shape,
      a.value.is_sparse
    );
    res.parents = [a, b];

    res.feed = () => {
      for (let v = 0; v < res.value.data.length; v++) {
        res.value.data[v] = 0;
      }

      ops.matmul(a.value, b.value, res.value);
      res.grad.shape = Array.from(res.value.shape);
    };

    res.feed();

    res.back = () => {
      let at = new nArray(
        new Array(a.value.data.length).fill(0),
        a.value.shape,
        a.value.is_sparse
      );
      let bt = new nArray(
        new Array(b.value.data.length).fill(0),
        b.value.shape,
        b.value.is_sparse
      );
      let grada = new nArray(
        new Array(a.grad.data.length).fill(0),
        a.grad.shape,
        a.grad.is_sparse
      );
      let gradb = new nArray(
        new Array(b.grad.data.length).fill(0),
        b.grad.shape,
        b.grad.is_sparse
      );

      let dima = at.shape.map((v, i) => i);
      let t = dima[dima.length - 1];
      dima[dima.length - 1] = dima[dima.length - 2];
      dima[dima.length - 2] = t;

      ops.transpose(a.value, at, dima);

      let dimb = bt.shape.map((v, i) => i);
      t = dimb[dimb.length - 1];
      dimb[dimb.length - 1] = dimb[dimb.length - 2];
      dimb[dimb.length - 2] = t;

      ops.transpose(b.value, bt, dimb);

      ops.matmul(res.grad, bt, grada);
      ops.matmul(at, res.grad, gradb);

      let gradA = ops.unbroadcast(grada, a.grad.shape);
      let gradB = ops.unbroadcast(gradb, b.grad.shape);

      ops.basic(gradA, a.grad, a.grad, ops.basic_types.add);
      ops.basic(gradB, b.grad, b.grad, ops.basic_types.add);
    };

    return res;
  }

  public log<arr>(a: Tensor<arr>) {
    return this.applyfn(
      a,
      (z) => {
        return Math.log(z);
      },
      (z) => {
        return 1 / z;
      }
    );
  }

  public bfs<arr>(
    starting_node: Tensor<arr> | Tensor<arr>[],
    loss?: Tensor<arr> | Tensor<arr>[]
  ) {
    if (Array.isArray(starting_node)) {
      if (loss) {
        if (!Array.isArray(loss)) {
          throw new Error("loss should be array");
        }
        starting_node.forEach((s, i) => {
          if (loss[i])
            ops.basic(s.grad, loss[i].value, s.grad, ops.basic_types.add);
          else s.grad.data = s.grad.data.map((v) => 1);
        });
      } else {
        starting_node.forEach((s, i) => {
          s.grad.data = s.grad.data.map((v) => 1);
        });
      }
    } else {
      if (Array.isArray(loss)) {
        throw new Error("loss should not be array");
      }

      if (loss)
        ops.basic(
          starting_node.grad,
          loss.value,
          starting_node.grad,
          ops.basic_types.add
        );
      if (!loss)
        starting_node.grad.data = starting_node.grad.data.map((v) => 1);
    }

    let Queue: Tensor<arr>[] = [];
    Queue = Queue.concat(starting_node);

    while (Queue.length > 0) {
      let node = Queue.pop();
      if (node) {
        node.back();
        node.parents.forEach((p) => {
          if (p) Queue.push(p);
        });

        // Sort
        Queue.sort((a, b) => a.id - b.id);
      } else {
        break;
      }
    }
  }

  private backpass_main<arr>(s: Tensor<arr> | null) {
    if (!s) return;

    s.back();

    for (let p = 0; p < s.parents.length; p++) {
      this.backpass_main(s.parents[p]);
    }
  }

  /**
   * This will Compute the gradient (derivatives) of the current vertex's tensor (tensor_) and
   * adds the results with grad_ (grad_ is initialized with value (0)).
   *
   * grad_ must be zero before calling it.
   *
   * The graph which is constructed while the forword operation is differentiated using chain rule.
   *
   * @param {Tensor} s Resultant vertex or Starting vertex.
   * @param {Tensor} initial_grad Initial grad or derivative to start with.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let w = dn.randn([2, 2]);
   * let result = dn.mul(a, w)
   *
   * dn.backpass(result); // <<<
   * ```
   */
  backpass<arr>(s: Tensor<arr>, initial_grad?: Tensor<arr>) {    
    this.bfs(s, initial_grad);
  }

  /**
   * This will Reset the grad (grad_).
   * this should be called after update_loss.
   *
   * @param {Tensor} s Resultant vertex or Starting vertex.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let w = dn.randn([2, 2]);
   * let result = dn.mul(a, w)
   *
   * dn.backpass(result);
   * dn.grad_zero(result); // <<< used after backpass
   * ```
   */
  grad_zero<arr>(s: Tensor<arr> | null) {
    if (!s) return;

    s.grad.data = s.grad.data.map((v) => 0);

    for (let p = 0; p < s.parents.length; p++) {
      this.grad_zero(s.parents[p]);
    }
  }

  /**
   * This will recalculate the forword propogation.
   *
   * @param s  Resultant vertex or Starting vertex.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let w = dn.randn([2, 2]);
   * let result = dn.mul(a, w)
   *
   * dn.backpass(result);
   * dn.get_output(result) // <<< this will recalculate
   * ```
   */
  get_output<arr>(s: Tensor<arr> | null) {
    if (!s) return;

    for (let p = 0; p < s.parents.length; p++) {
      this.get_output(s.parents[p]);
    }

    s.feed();

    return s;
  }

  /**
   * ## Activations
   */

  /**
   * Computes sigmoid activation element-wise
   * @param {Tensor} a The tensor to apply a function.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let result = dn.sig(a);
   * result.print();
   * ```
   */
  sig<arr>(a: Tensor<arr>) {
    return this.applyfn(
      a,
      (z: number) => {
        return 1.0 / (1.0 + Math.exp(-1 * z));
      },
      (z: number) => {
        return (
          (1.0 / (1.0 + Math.exp(-1 * z))) *
          (1 - 1.0 / (1.0 + Math.exp(-1 * z)))
        );
      }
    );
  }

  /**
   * Computes Relu activation element-wise
   * @param {Tensor} a The tensor to apply a function.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let result = dn.relu(a);
   * result.print();
   * ```
   */
  relu<arr>(a: Tensor<arr>) {
    return this.applyfn(
      a,
      (z: number) => {
        if (0 > z) {
          return 0;
        } else if (0 < z) {
          return z;
        } else {
          return z;
        }
      },

      (z: number) => {
        if (z > 0) {
          return 1;
        } else {
          return 0;
        }
      }
    );
  }

  /**
   * Computes tanh activation element-wise
   * @param {Tensor} a The tensor to apply a function.
   *
   * ```js
   * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
   * let result = dn.tanh(a);
   * result.print();
   * ```
   */
  tanh<arr>(a: Tensor<arr>) {
    return this.applyfn(
      a,

      (z: number) => {
        return (Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z));
      },

      (z: number) => {
        return (
          1 -
          (((Math.exp(z) - Math.exp(-z)) / (Math.exp(z) + Math.exp(-z))) *
            (Math.exp(z) - Math.exp(-z))) /
            (Math.exp(z) + Math.exp(-z))
        );
      }
    );
  }

  protected applyfn<arr>(
    a: Tensor<arr>,
    fn: (a: number) => number,
    delta: (a: number) => number
  ) {
    let res = new Tensor(
      new Array(a.value.data.length).fill(0),
      a.value.shape,
      a.value.is_sparse
    );

    res.parents = [a, null];

    res.feed = () => {
      ops.applyfn(a.value, res.value, fn);
    };

    res.feed();

    res.back = () => {
      let grad = new nArray(
        new Array(a.grad.data.length).fill(0),
        a.grad.shape,
        a.grad.is_sparse
      );
      ops.applyfn(a.value, grad, delta);

      ops.basic(res.grad, grad, grad, ops.basic_types.mul);

      ops.basic(grad, a.grad, a.grad, ops.basic_types.add);
    };

    return res;
  }

  public optimizer = {
    /**    
         * ## SGD
         *       
         * Constructs an Optimizer that uses (SGD) stochastic gradient descent.         
         * @param {Tensor_array} parameters Paremeters to update.
         * @param {number} lr The learning rate for the SGD.
         * 
         * ```js
         * let a = dn.tensor([1, 2, 3, 4], [2, 2]);
         * let w = dn.randn([2, 2]);
         * let b = dn.randn([2, 2]);
    
         * let optm = dn.optimizer.SGD([w, b], 0.04); //<<
         * let result = dn.add(dn.matmul(a, w), b)
         * let loss = dn.sub(result, dn.tensor([0, 1, 0, 1], [2, 2]));              
        
         * dn.backpass(result, loss);
         * optm.step(); //<<
         * dn.grad_zero(result);
         * ```
         */
    SGD: <arr>(parameters: Tensor<arr>[], lr: number) => {
      return new SGD(parameters, lr);
    },
  };

  public nn = {
    Linear: (
      in_features: number,
      out_features: number,
      bias: boolean = true
    ) => {
      function feed<arr>(input: Tensor<arr>) {
        let m_res = feed.matmul(input, feed.transpose(feed.weights));

        if (bias) return feed.add(m_res, feed.biases);
        else return m_res;
      }

      feed.matmul = this.matmul;
      feed.transpose = this.transpose;
      feed.add = this.add;

      feed.in_features = in_features;
      feed.out_features = out_features;
      feed.weights = this.ones([feed.out_features, feed.in_features]);
      feed.biases = this.ones([feed.out_features]);

      return feed;
    },

    RNNcell: (
      in_features: number,
      out_features: number,
      bias = true,
      Axis?: number
    ) => {
      function feed<arr>(input: Tensor<arr>) {
        const axis = Axis ? Axis : input.value.shape.length - 2;
        const inputs = feed.split(
          input,
          axis,
          new Array(input.value.shape[axis]).fill(1 / input.value.shape[axis])
        );

        let res: Tensor<arr>[] = [];

        for (let i = 0; i < inputs.length; i++) {
          // console.log(inputs[i], feed.weight)
          let result = feed.matmul(inputs[i], feed.transpose(feed.weight));
          if (i > 0) {
            const inner = feed.matmul(
              feed.prev_output,
              feed.transpose(feed.hiddenWeight)
            );
            result = feed.add(result, inner);
          }

          // if(bias) {
          //     result = feed.add(result, feed.add(feed.biases, feed.hiddenBiases));
          // }

          feed.prev_output = result;
          res.push(result);
        }

        return res.reduce((a, b) => feed.concat([a, b], axis));
      }

      // methods
      feed.matmul = this.matmul;
      feed.transpose = this.transpose;
      feed.add = this.add;
      feed.zeros = this.zeros;
      feed.split = this.split;
      feed.concat = this.concat;

      // props
      feed.in_features = in_features;
      feed.out_features = out_features;

      feed.prev_output = this.tensor(0);

      feed.weight = this.ones([out_features, in_features]);
      feed.biases = this.ones([out_features]);

      feed.hiddenWeight = this.ones([out_features, out_features]);
      feed.hiddenBiases = this.ones([out_features]);

      return feed;
    },
  };
}

class SGD<arr> {
  constructor(private parameters: Tensor<arr>[], private lr: number) {}

  step() {
    this.parameters.forEach((t) => {
      for (let i = 0; i < t.value.data.length; i++) {
        t.value.data[i] -= t.grad.data[i] * this.lr;
      }
    });
  }
}
