#include "draw.h"
#include "parse.h"
#include "operations.h"
#include <algorithm>
#include <math.h> // > I believe that this is the correct library
#include <vector>
#include <algorithm>

// > Helper Drawing Functions

void colorPixelBasic(dataState & state){

}
void DDABasic(dataState & state){

}

// Scanline Helper - find top bottom middle vectors
// > Returns first top, then bottom then middle
std::vector<vecState> findTMB(const dataState & state, int offset){

    // printf("Entered findTBM \n") ; // > DEBUG

    std::vector<vecState> retVec ; 
    int realOffset = 3 * offset ;

    // > Init vecs
    vecState t_vec ; t_vec.populateSimple(realOffset , state) ;
    vecState b_vec ; b_vec.populateSimple(realOffset + 1  , state) ; 
    vecState m_vec ; m_vec.populateSimple(realOffset + 2 , state) ;

    vecState temp_vec ;

    // > Find max and min
    // printf("Vecotrs populated\n") ; // > DEBUG
    

    
    if(t_vec.pos[1] < m_vec.pos[1]){
        //swap if m_vec bigger
        temp_vec = t_vec ;
        t_vec = m_vec ;
        m_vec = temp_vec ;
    }
    if(t_vec.pos[1] < b_vec.pos[1]){
        //swao uf b vec larger
        temp_vec = t_vec ;
        t_vec = b_vec ;
        b_vec = temp_vec ;
    }
    // > top vector is in correct spot, only need to swap medium and bottom
    // > Honestly might not even need this last swap but Im tired and dont want to figure it out
    if(b_vec.pos[1] > m_vec.pos[1]){
        temp_vec = b_vec ;
        b_vec = m_vec ;
        m_vec = temp_vec ; 
    }
   
    retVec.push_back(t_vec) ; retVec.push_back(m_vec) ; retVec.push_back(b_vec) ;
    //  printf("sorttest \n") ; // !!DEBUG
    
    
    // > I know this is fuckign sloppy sorry
    std::reverse(retVec.begin(), retVec.end()) ;
    // printf("Print Vecs\n") ;// DEBUG
    // printSimpleVecs(retVec, true, true, false) ;
    return retVec ; 
}

// > No alpha channel, no color / texture interpolation
void scanLineBasic(dataState & state){
std::vector<vecState> TMB = findTMB(state, 0) ;

// > Set up line from t to b
// - - - - - - - - - - - - -
// d is y for scanline
vecState delta_tb_vec = subVecs(TMB[2], TMB[0], false) ;
// printSimpleVec(delta_tb_vec, 1, 0, 0) ;
vecState s_tb_vec = scaleVec(delta_tb_vec, 1 / delta_tb_vec.pos[1]) ; 
double e_tb_scalar = std::ceil(TMB[0].pos[1]) - TMB[0].pos[1];
vecState o_tb_vec = scaleVec(s_tb_vec, e_tb_scalar) ;
vecState p_tb_point = addVecs(TMB[0], o_tb_vec, false) ;

//printf("P vec\n") ; // DEBUG
// printSimpleVec(s_tb_vec, true, false, false) ;

// > Set up line from t to m
vecState delta_tm_vec = subVecs(TMB[1], TMB[0], false) ;
vecState s_tm_vec = scaleVec(delta_tm_vec, 1 / delta_tm_vec.pos[1]) ;
double e_tm_scalar = std::ceil(TMB[0].pos[1]) - TMB[0].pos[1] ;
vecState o_tm_vec = scaleVec(s_tm_vec, e_tm_scalar) ;
vecState p_tm_point = addVecs(TMB[0], o_tm_vec, false) ;


// printf("Print TB point 1\n") ; // DEBUG
// printSimpleVec(p_tb_point, true, false, false) ; // > Debug
// printf("Print TM point 1\n") ; // DEBUG
// printSimpleVec(p_tm_point, true, false, false) ; // > Debug

// > Run DDA in x loop # 1
vecState a_point = p_tm_point ; // > For notational consistency
vecState b_point = p_tb_point ;

vecState delta_x_vec ;
vecState s_x_vec ; 
double e_x_scalar ;
vecState o_x_vec ;
vecState p_x_point ;

while(p_tm_point.pos[1] < TMB[1].pos[1]){ // While p[y] < m[y]
    if(p_tm_point.pos[0] == p_tb_point.pos[0]){ // > If x values are the same
        // !!HANDLE SUCH THAT WE DRAW ONE POINT!!
    }
    if(a_point.pos[0] > b_point.pos[0]){ // > Swap
        a_point = p_tb_point ;
        b_point = p_tm_point ;
    }
    // > Find first potential point - - -
    delta_x_vec = subVecs(b_point, a_point, false) ;
    s_x_vec = scaleVec(delta_x_vec, 1 / delta_x_vec.pos[0]) ;
    e_x_scalar = std::ceil(a_point.pos[0]) - a_point.pos[0] ;
    o_x_vec = scaleVec(s_x_vec, e_x_scalar) ;
    p_x_point = addVecs(a_point, o_x_vec, false) ;

    // > begin drawing points
    while(p_x_point.pos[0] < b_point.pos[0]){
        
    }


}


}



// > Main Function - -- 
int drawArraysTrianglesBasic(int first, int count, dataState & state){
    divByWViewportBasic(state) ;
    scanLineBasic(state) ; 
    return 0 ; 
}