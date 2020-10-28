const { ndarray, ndvertex } = require("../objs/objs");
const { expand_to, concat, transpose} = require("./matrix_ops");
const { backpass, traversal, update_loss, detach } = require("./graph_ops");

const a = new ndvertex([1, 2, 3, 4], [2, 2])
const b = new ndvertex([5, 6, 7, 8], [2, 2])

const res = concat(a, b, 0)
backpass(res, new ndarray([1, 2, 3, 4, 5, 6, 7, 8], [4, 2]));
update_loss(res, 1);
traversal(res, 'grad', true);
detach(res)
