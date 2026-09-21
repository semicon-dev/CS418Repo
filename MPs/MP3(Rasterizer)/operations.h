#include <cstdio>
#include <string>
#include <vector>


// > General functions
void clearVXAT(struct vertexAttributes & VXAT) ; // > Init VXAT

void positionVXAT(struct vertexAttributes & VXAT, std::vector<double> vec) ; // > Populate position values

void colorVXAT(struct vertexAttributes & VXAT, std::vector<double> vec) ; // > Populate position values

std::vector<double> divByW() ;