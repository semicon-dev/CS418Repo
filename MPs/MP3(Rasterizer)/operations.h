#include <cstdio>
#include <string>
#include <vector>

// > Forward declarations
struct vertexAttributes ;
class dataState ;
class vecState ;

// > Debugging utils
void printVecNest(std::vector< std::vector<double> > vec) ; 

void printVec(std::vector<double> vec) ; 

void printSimpleVecs(std::vector<vecState>, bool pos, bool color, bool tex) ;

void printSimpleVec(vecState vec, bool pos, bool color, bool tex) ;

// void printVXAT(dataState state) ;

// > General functions
// void clearVXAT(struct vertexAttributes & VXAT) ; // > Init VXAT

// void positionVXAT(struct vertexAttributes & VXAT, std::vector<double> vec) ; // > Populate position values

// void colorVXAT(struct vertexAttributes & VXAT, std::vector<double> vec) ; // > Populate position values

// > Rasterization process functions (only handles position div by W)
void divByWViewportBasic(dataState & state) ;

// > Point operations
vecState subVecs(vecState p2, vecState p1, bool tex) ; 
vecState addVecs(vecState p2, vecState p1, bool tex) ; 
vecState scaleVec(vecState p1, double scale) ; 

