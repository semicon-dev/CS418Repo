//  > Main includes
#include <vector>
#include <string>
#include <fstream>
#include "./libs/uselibpng.h"
#include <cstdio>

// > MACROS
#define ATTRIBUTE_VEC_SIZE 10

struct vertexAttributes { // > This may have been a stupid fucking design decision
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
    std::vector<std::vector<double>> posVec ; 
    std::vector<std::vector<double>> colorVec ; 
    std::vector<std::vector<double>> texVec ; 

    // > Set of vectors 
    std::vector<std::vector<double>> posVecW ; 
    std::vector<std::vector<double>> colorVecW ; 
    std::vector<std::vector<double>> texVecW ; 

    // > Modes
    bool depth ; 
    bool sRGB ; 
    bool hyp ; // > div w
    int fsaa ; 
    bool cull ; 
    bool decals ;
    bool frustum ; // > Clipping

    // > Sizes
    int posSize ; 
    int colorSize ; 
    int texSize ; 
    int ptSize ; 
    
    // > Methods
    dataState() ; // > Constructor
    void saveImage() ;
    

} ;


class vecState {
    public :
    // > Set of vectors 
   std::vector<double> pos ; 
   std::vector<double> color ; 
   std::vector<double> tex ;

    // > Methods
    vecState() ;
    void populateSimple(int offset, const dataState & state) ;
};

// > Functions


int parseFile(std::string filepath) ; 
