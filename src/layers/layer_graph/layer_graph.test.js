const dense = require('../dense.layer');
const merge = require('../merge.layer');
const lgraph = require('./layer_graph')
const lg = new lgraph();
const lv = lg.layerVertex;

const a = new lv(new dense(1, 2), null, null, 'first');
const b = new lv(new dense(1, 2), null, null, 'first');

const c = new lv(new dense(2, 5), [a, b], null, 'merge')

for(let i = 0; i < 100; i++){
    lg.feedForword(c)
    lg.backpropagation([0, 1, 0, 1, 1])
}

lg.feedForword(c).print()