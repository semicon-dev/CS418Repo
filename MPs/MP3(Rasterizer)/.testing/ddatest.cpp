#include "./libs/uselibpng.h"
#include <string>
#include <vector>


class imgData {
    public :
    // > Members
    std::vector<int> posVec ; 
    int errorCode ; 
    int w, h ; 
    
    // > Methods
    imgData(){} ; // > Constructor
    std::vector<int> getColor(int i) ; // > Returns 3-vector of colors at offset i*3
    std::vector<int> getPos(int i) ; // > Returns 2-vector of positions at offset i*2

} ;



imgData basicParser(){


 
}

int main() {
    std::string path = "./test2/test1.txt" ; 







}



