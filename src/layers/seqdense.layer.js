const dense = require('./dense.layer')

module.exports = class seqdense extends dense{
    constructor(prev_neurons, neurons){
        super(prev_neurons, neurons)
    }    
        
    feed(input = []){
        const res = []
        for(let i = 0; i < input.length; i++){
            res.push(super.feed(input[i]))
        }
        return res
    }    
}