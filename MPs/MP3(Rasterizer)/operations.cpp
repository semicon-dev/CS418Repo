#include "operations.h"
#include "parse.h"

// Base populate vertexAttribute
void clearVXAT(struct vertexAttributes & VXAT){
    for(int i = 0 ; i < 10 ; i ++){
        VXAT.arr[i] = 0 ;
    }
    VXAT.arr[3] = 1 ; // Init w to 1
}   

// > Populate position for VXAT
void positionVXAT(struct vertexAttributes & VXAT, std::vector<double> posVec){
    for(int i = 0 ; i < posVec.size() ; i ++){
        VXAT.arr[i] = posVec[i] ;
    }
}
// > Populate Color for VXAT
void colorVXAT(struct vertexAttributes & VXAT, std::vector<double> colVec) {
    for(int i = 0 ; i < colVec.size() ; i ++){
        VXAT.arr[4 + i] = colVec[i] ;
    }
}