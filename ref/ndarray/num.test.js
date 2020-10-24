const ndarray = require('./ndarray');
const ndf = require('./ndarray_fn');
const ndfn = new ndf({
    return_type: 'ndarray'
})

test("1", ()=>{
    expect(1).toBe(1)
})
