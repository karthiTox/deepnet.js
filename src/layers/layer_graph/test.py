import numpy;

a = numpy.array([1, 2, 3, 4]).reshape([1, 2, 2])
b = numpy.array([1, 2, 3, 4]).reshape([1, 2, 2])
print(
    numpy.concatenate((a, b), axis=1)
)