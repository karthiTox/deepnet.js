const { ndvertex, ndarray } = require('../../core/ndfn/objs/objs');
const { add } = require('../../core/ndfn/ops/basic_ops');
const { traversal } = require('../../core/ndfn/ops/graph_ops');
const dense = require('../dense.layer');
const rnn = require('../rnn.layer');
const lstm = require('../lstm.layer');
const merge = require('../merge.methods');

const lgraph = require('./layer_graph')
const model = new lgraph();

const a = model.add({layer: new rnn(1, 5)})
const b = model.add({layer: new rnn(5, 1)})

for(let i = 0; i < 1000; i++){
    model.feedForword(
        [new ndvertex([0], [1, 1]), new ndvertex([0], [1, 1])]
    )
    model.backpropagation(
        [new ndarray([0], [1, 1]), new ndarray([1], [1, 1])]
        );

    model.feedForword(
        [new ndvertex([1], [1, 1]), new ndvertex([0], [1, 1])]
    )
    model.backpropagation(
        [new ndarray([0], [1, 1]), new ndarray([0], [1, 1])]
    );
}

console.log(
    model.feedForword([new ndvertex([0], [1, 1]), new ndvertex([0], [1, 1])]).forEach(v =>{
        v.forEach(v => v.print())
    })
)

// function run(){
//     const res = [new ndvertex([1])].reduce((a, b) => add(a, b))
//     console.log(res)
// }
// run()