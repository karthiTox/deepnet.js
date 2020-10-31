const _ndfn = require('./core/ndfn/ndfn');
const layers = require('./layers/layers')
const _layerGrap = require('./layers/layer_graph/layer_graph')
const _activation = require('./core/util/activation')
const _merge_fn = require('./layers/merge.methods')

module.exports = {
    ndfn: _ndfn,

    layers: layers,

    models:{
        LayerGraph: _layerGrap
    },

    activation: _activation,
    mergefn: _merge_fn,
}