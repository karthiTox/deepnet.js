import { Tensor, ops_cpu } from "./tensor_ops";
import { nArray } from "./Array";
import { ops } from "./array_ops";

test("basic - nArray {}", ()=>{

    let a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], true);
    let b = new nArray([1, 0, 3, 4], [2, 2], true);
    let r = new nArray([], [2, 2], true)
    ops.basic( a, b,  r,  ops.basic_types.add )
    
    expect(r.data).toStrictEqual([2, 6, 8, 6, 3, 4]);
    expect(r.index).toStrictEqual([0, 2, 3, 4, 6, 7]);

})

test("transpose - nArray {}", ()=>{
    
    // sparse    
    let a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], true);    
    let r = new nArray([], [2, 2], true);    
    
    ops.transpose(a, r, [0, 1, 2]);
    expect(r.data).toStrictEqual([1, 3, 4, 5]);
    expect(r.index).toStrictEqual([0, 2, 3, 4]);

    // dense
    a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], false);    
    r = new nArray([], [2, 2], false);

    ops.transpose(a, r, [0, 2, 1]);
    expect(r.data).toStrictEqual([1, 3, 0, 4, 5, 0, 0, 0]);

})

test("matmul - nArray {}", ()=>{

    let a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], true);
    let b = new nArray([1, 0, 3, 4], [2, 2], true);
    let r = new nArray([], [2, 2], true)
    ops.matmul( a, b,  r)    
    expect(r.data).toStrictEqual([1, 15, 16, 5]);

    a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], false);
    b = new nArray([1, 0, 3, 4], [2, 2], false);
    r = new nArray([], [2, 2], false)
    ops.matmul( a, b,  r)    
    expect(r.data).toStrictEqual([1, 0, 15, 16, 5, 0, 0, 0]);

    a = new nArray([1, 2], [1, 2], false);
    b = new nArray([1, 2], [2, 1], false);
    r = new nArray([], [2, 2], false)
    ops.matmul( a, b,  r)    
    expect(r.data).toStrictEqual([5]);
    
})

test("applyfn - nArray {}", ()=>{

    let a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], true);
    let r = new nArray([], [2, 2], true)
    ops.applyfn(a, r, (n)=>n*-1);    
    expect(r.data).toStrictEqual([-1, -3, -4, -5]);

    a = new nArray([1, 0, 3, 4, 5, 0, 0, 0], [2, 2, 2], false);
    r = new nArray([], [2, 2], false)
    ops.applyfn(a, r, (n)=>n*2);    
    expect(r.data).toStrictEqual([2, 0, 6, 8, 10, 0, 0, 0]);
    
})