const _dense = require('./dense.layer');
const _seqdense = require('./seqdense.layer');
const _rnn = require('./rnn.layer');
const _lstm = require('./lstm.layer');

module.exports = {
    dense: _dense,   
    seqdense: _seqdense,   
    rnn: _rnn,   
    lstm: _lstm,   
}