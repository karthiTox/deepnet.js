import {ops_cpu} from "./tensor_ops";

let ops = new ops_cpu();

let a = ops.tensor([1, 2, 3, 4], [2, 2]);

let a_s = ops.tensor([1, 2, 3, 4], [2, 2], true);

test("basic - tensor-cpu", ()=>{
    
    // dense
    let r = ops.add(a_s, a_s);
    expect(r.value.data).toStrictEqual([2, 4, 6, 8]);    
    expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    

    // dense
    r = ops.add(a, a);
    expect(r.value.data).toStrictEqual([2, 4, 6, 8]);    

})


test("basic - div - tensor-cpu", ()=>{
    
    // dense
    let r = ops.div(a_s, a_s);
    expect(r.value.data).toStrictEqual([1, 1, 1, 1]);    
    expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    

    // dense
    r = ops.div(a, a);
    expect(r.value.data).toStrictEqual([1, 1, 1, 1]);    

})


test("matmul - tensor-cpu", ()=>{
    
    // dense
    let r = ops.matmul(a_s, a_s);
    expect(r.value.data).toStrictEqual([7, 10, 15, 22]);    
    expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    

    // dense
    r = ops.matmul(a, a);
    expect(r.value.data).toStrictEqual([7, 10, 15, 22]);    

})

test("transpose - tensor-cpu", ()=>{
    
    // dense
    let r = ops.transpose(a_s, [1, 0]);
    expect(r.value.data).toStrictEqual([1, 3, 2, 4]);    
    expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    

    // dense
    r = ops.transpose(a, [1, 0]);
    expect(r.value.data).toStrictEqual([1, 3, 2, 4]);    

})