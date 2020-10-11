const narray = require('./n-array');

const narray_fn = require('./n-array.fn')
const ngraph = require('./n-graph.fn')

const ngraph_fn = ngraph.ngraph
const node = ngraph.node;
const edge = ngraph.edge;

function run(){
    const fn = new ngraph_fn();
    const a = new node([1, 1], [1, 2]);    
    const w = new node([Math.random(), Math.random()], [2, 1]);


    console.log(
        fn.matmul(
            new node([[1], [1]]),
            new node([[1]])            
        )
    )

    // const res = fn.matmul(a, w)
    
    // fn.backpass(res, new narray([1], [1, 1]))
    // fn.travel(res, 'val', true)
}

run()