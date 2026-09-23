#include "operations.h"
#include "parse.h"
#include <vector>


// > Debugging helpers - - - 

// > Vector Print Helper
void printVec(std::vector<double> vec){
    for(int i = 0 ; i < vec.size() ; i ++){
        printf("Item : %f \n", vec[i] ) ; 
    }
    return ; 
}
// > Nested Print Helper
void printVecNest(std::vector< std::vector<double> > vec){

    for(int i = 0 ; i < (vec.size()) ; i ++){
        printf("vec ") ; 
        for(int j = 0 ; j < vec[i].size() ; j++){
            printf("%f ", vec[i][j]) ; 
        }
        printf("\n") ; 
    }

}

void printSimpleVec(vecState state, bool pos, bool color, bool tex){
    if(pos){
            printf("pos \n") ; 
            printVec(state.pos) ;
    }

    if(color){
            printf("color \n") ; 
            printVec(state.color) ;

    }

    if(tex){
            printf("tex \n") ; 
            printVec(state.tex) ;
    }
}

// > Print points
void printSimpleVecs(std::vector<vecState> vec, bool pos, bool color, bool tex){
    for(int i = 0 ; i < vec.size() ; i++ ){
        printf("Point %d \n", i) ;
        if(pos){
            printf("pos \n") ; 
            printVec(vec[i].pos) ;
        }
        if(color){
            printf("color \n") ; 
            printVec(vec[i].color) ;

        }
        if(tex){
            printf("tex \n") ; 
            printVec(vec[i].tex) ;

        }
    }
}

void printVXAT(dataState state){
    for(int i = 0; i < state.vertexArr.size() ; i ++){
        printf("Vector") ; 
        printf("\n") ;
    }
}

// > Data handling helpers

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

// -------------------------------------------
// -------------------------------------------
// -------------------------------------------
// > DRAW HELPER AND RASTERIZATION FUNCTIONS
// -------------------------------------------
// -------------------------------------------
// -------------------------------------------

// > Divide by W helper function
void divByWViewportBasic(dataState & state){

    // Divide positions by W
    std::vector<double> curVec ;
    double curW ; 
    state.posVec = state.posVec ;
    for(int i = 0 ; i < state.posVec.size() ; i ++){
        curW = state.posVec[i][3] ; 
        // printf("It : %d \n", i) ; //!!DEBUG
        state.posVec[i][3] = 1 / curW ; 
        for(int j = 0 ; j < state.posVec[i].size() -1 ; j ++){
            state.posVec[i][j] = state.posVec[i][j] / curW ; 
        }
    }
    // Transform position coords to viewport (x,y) only 
    for(int i = 0 ; i < state.posVec.size() ; i++){
            state.posVec[i][0] = (state.posVec[i][0] + 1) * state.wPix / 2 ;
            state.posVec[i][1] = (state.posVec[i][1] + 1) * state.hPix / 2 ;
    }

}



// >> ALL SUPER SIMPLE, NO COMPLEX BULLSHIT GOING ON RIGHT HERE
// > Point operation functions (simple, no hyp, no texture)
vecState subVecs(vecState p2, vecState p1, bool tex){
    vecState retVec ;
    std::vector<double> newPos ; 
    std::vector<double> newCol ; 
    
    // > Populate Position
    newPos.push_back(p2.pos[0] - p1.pos[0]) ;
    newPos.push_back(p2.pos[1] - p1.pos[1]) ;
    // > Populate Color
    newCol.push_back(p2.color[0] - p1.pos[0]) ;
    newCol.push_back(p2.color[1] - p1.pos[1]) ;
    newCol.push_back(p2.color[2] - p1.pos[2]) ;
    

    retVec.pos = newPos ;
    retVec.color = newCol ; 

    return retVec ;
}

// > Point operation functions (simple, no hyp, no texture)
vecState addVecs(vecState p2, vecState p1, bool tex){
    vecState retVec ;
    std::vector<double> newPos ; 
    std::vector<double> newCol ; 
    
    // > Populate Position
    newPos.push_back(p2.pos[0] + p1.pos[0]) ;
    newPos.push_back(p2.pos[1] + p1.pos[1]) ;
    // > Populate Color
    newCol.push_back(p2.color[0] + p1.pos[0]) ;
    newCol.push_back(p2.color[1] + p1.pos[1]) ;
    newCol.push_back(p2.color[2] + p1.pos[2]) ;
    

    retVec.pos = newPos ;
    retVec.color = newCol ; 

    return retVec ;
}

vecState scaleVec(vecState p1, double scale){
        vecState retVec ;
    std::vector<double> newPos ; 
    std::vector<double> newCol ; 
    
    // > Populate Position
    newPos.push_back(p1.pos[0] * scale) ;
    newPos.push_back(p1.pos[1] * scale) ;
    // > Populate Color
    newCol.push_back(p1.color[0] * scale) ;
    newCol.push_back(p1.color[0] * scale) ;
    newCol.push_back(p1.color[0] * scale) ;
    

    retVec.pos = newPos ;
    retVec.color = newCol ; 

    return retVec ;
}