//  > Main includes
#include <vector>
#include <string>
#include <fstream>
#include "./libs/uselibpng.h"
#include <cstdio>

// > MACROS
#define ATTRIBUTE_VEC_SIZE 10

struct vertexAttributes {
    double arr[ATTRIBUTE_VEC_SIZE] ;
} ;

// > Create a struct for holding data
class dataState {

    public :
    // > Members - - -
    // - - - - - - - -
    std::string filename ; 
    int wPix, hPix ; // > Width (x) and Hieght (y) of image
    Image * img ;

    // > Populate this
    std::vector<vertexAttributes> vertexArr ; // > Array of all verties to draw

    // > Modes
    bool depth ; 
    bool sRGB ; 
    bool hyp ; // > div w
    int fsaa ; 
    bool cull ; 
    bool decals ;
    bool frustum ; 

    // > Sizes
    int posSize ; 
    int colorSize ; 
    int texSize ; 
    int ptSize ; 
    
    // > Methods
    dataState() ; // > Constructor
    

} ;


// > Functions


int parseFile(std::string filepath) ; 
