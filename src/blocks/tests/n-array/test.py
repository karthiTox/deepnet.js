import numpy


a = numpy.array(
    [1, 2, 3, 4]
).reshape([2, 2, 1])

b = numpy.array(
    [1, 2, 3, 4]
).reshape([2, 1, 2])

print(a @ b)