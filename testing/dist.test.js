let deepnet_node = require("../dist_node/deepnet.main");
let deepnet_browser = require("../dist/deepnet-browser");

run_test(deepnet_node, "(node)");
run_test(deepnet_browser, "(browser)");

function run_test(deepnet, name="") {
    
    
    test("basic" + " " + name, ()=>{
        return deepnet.platforms.cpu().then((ops) => {
            let a_s = ops.tensor([1, 2, 3, 4], [2, 2], true);
            let a = ops.tensor([1, 2, 3, 4], [2, 2]);

            // dense
            let r = ops.add(a_s, a_s);
            expect(r.value.data).toStrictEqual([2, 4, 6, 8]);    
            expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    
        
            // dense
            r = ops.add(a, a);
            expect(r.value.data).toStrictEqual([2, 4, 6, 8]);    
        })    
    })
    
    test("matmul"  + " " + name, ()=>{
        return deepnet.platforms.cpu().then((ops) => {
            let a_s = ops.tensor([1, 2, 3, 4], [2, 2], true);
            let a = ops.tensor([1, 2, 3, 4], [2, 2]);
            
            // dense
            let r = ops.matmul(a_s, a_s);
            expect(r.value.data).toStrictEqual([7, 10, 15, 22]);    
            expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    
    
            // dense
            r = ops.matmul(a, a);
            expect(r.value.data).toStrictEqual([7, 10, 15, 22]);    
        })
    })
    
    test("transpose" + " " + name, ()=>{
        return deepnet.platforms.cpu().then((ops) => {
            let a_s = ops.tensor([1, 2, 3, 4], [2, 2], true);
            let a = ops.tensor([1, 2, 3, 4], [2, 2]);
            
            // dense
            let r = ops.transpose(a_s, [1, 0]);
            expect(r.value.data).toStrictEqual([1, 3, 2, 4]);    
            expect(r.value.index).toStrictEqual([0, 1, 2, 3]);    
    
            // dense
            r = ops.transpose(a, [1, 0]);
            expect(r.value.data).toStrictEqual([1, 3, 2, 4]);    
        });
    })

}