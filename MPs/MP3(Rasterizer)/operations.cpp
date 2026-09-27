#include "operations.h"
#include "parse.h"
#include <vector>


// > Debugging helpers - - - 

// > Vector Print Helper
void printVector(std::vector<double> vec){
    for(int i = 0 ; i < vec.size() ; i ++){
        printf("Item : %f \n", vec[i] ) ; 
    }
    return ; 
}
// > Nested Print Helper
void printVectorNest(std::vector< std::vector<double> > vec){

    for(int i = 0 ; i < (vec.size()) ; i ++){
        printf("vec ") ; 
        for(int j = 0 ; j < vec[i].size() ; j++){
            printf("%f ", vec[i][j]) ; 
        }
        printf("\n") ; 
    }

}

// Vector int printerse
void printVectorInt(std::vector<int> vec){
    for(int i = 0 ; i < vec.size() ; i ++){
        printf("Item : %d \n", vec[i] ) ; 
    }
    return ; 
}
// > Nested Print Helper
void printVectorNestInt(std::vector< std::vector<int> > vec){

    for(int i = 0 ; i < (vec.size()) ; i ++){
        printf("vec ") ; 
        for(int j = 0 ; j < vec[i].size() ; j++){
            printf("%d ", vec[i][j]) ; 
        }
        printf("\n") ; 
    }

}


void printSimpleVec(vecState state, bool pos, bool color, bool tex){
    if(pos){
            printf("pos \n") ; 
            printVector(state.pos) ;
    }

    if(color){
            printf("color \n") ; 
            printVector(state.color) ;

    }

    if(tex){
            printf("tex \n") ; 
            printVector(state.tex) ;
    }
}


// > Print points
void printSimpleVecs(std::vector<vecState> vec, bool pos, bool color, bool tex){
    for(int i = 0 ; i < vec.size() ; i++ ){
        printf("Point %d \n", i) ;
        if(pos){
            printf("pos \n") ; 
            printVector(vec[i].pos) ;
        }
        if(color){
            printf("color \n") ; 
            printVector(vec[i].color) ;

        }
        if(tex){
            printf("tex \n") ; 
            printVector(vec[i].tex) ;

        }
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
    state.posVecW = state.posVec ;
    for(int i = 0 ; i < state.posVec.size() ; i ++){
        curW = state.posVec[i][3] ; 
        // printf("It : %d \n", i) ; //!!DEBUG
        state.posVecW[i][3] = 1 / curW ; 
        for(int j = 0 ; j < state.posVec[i].size() -1 ; j ++){
            state.posVecW[i][j] = state.posVec[i][j] / curW ; 
        }
    }
    // Transform position coords to viewport (x,y) only 
    for(int i = 0 ; i < state.posVec.size() ; i++){
            state.posVecW[i][0] = (state.posVecW[i][0] + 1) * state.wPix / 2 ;
            state.posVecW[i][1] = (state.posVecW[i][1] + 1) * state.hPix / 2 ;
    }

    // > Multply colors by 255
    if(state.colorSize != 4){
        // > Create new Color Vector
        state.colorVecW = state.colorVec ;
    }
    // printVectorNest(state.colorVecW) ;
    
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
    newCol.push_back(p2.color[0] - p1.color[0]) ;
   
    newCol.push_back(p2.color[1] - p1.color[1]) ;

    newCol.push_back(p2.color[2] - p1.color[2]) ;

    

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
    newCol.push_back(p2.color[0] + p1.color[0]) ;

    newCol.push_back(p2.color[1] + p1.color[1]) ;

    newCol.push_back(p2.color[2] + p1.color[2]) ;

    
    

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

    newCol.push_back(p1.color[1] * scale) ;

    newCol.push_back(p1.color[2] * scale) ;

    
    // > My man's got a hear like a rock cast in the sea - - - Saint Louis Blues. Bessie Smith


    retVec.pos = newPos ;
    retVec.color = newCol ; 

    return retVec ;
}