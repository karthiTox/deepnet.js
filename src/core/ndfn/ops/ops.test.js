const { ndarray } = require("../objs/objs");
const { expand_to, concat } = require("./matrix_ops");

const a = new ndarray([1, 2, 3, 4], [2, 2])
a.print()

    concat(concat(a, a), a).print()