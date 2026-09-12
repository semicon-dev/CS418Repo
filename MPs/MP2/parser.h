//  > Main includes
#include <vector>
#include <string>
#include <fstream>

// > Create a struct for holding parsed data
class imgData {
    public :
    // > Members
    std::vector<int> colorVec ;
    std::vector<int> posVec ; 
    std::vector<int> nVec ; // > Number of pixels to draw - - -
    int errorCode ; 
    int w, h ; 
    std::string imgName ; 
    
    // > Methods
    imgData() ; // > Constructor
    std::vector<int> getColor(int i) ; // > Returns 3-vector of colors at offset i*3
    std::vector<int> getPos(int i) ; // > Returns 2-vector of positions at offset i*2

} ;

// > Parse file

imgData iLoveParsingFiles(std::string filepath) ; 


