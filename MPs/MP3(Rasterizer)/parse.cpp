#include <string>
#include "operations.h"
#include "draw.h"
#include "parse.h"

// Functions for imgData class

// > Constructor
dataState::dataState(){
    
    // > Set state
    depth = false ;
    sRGB = true ;
    hyp = false ; // > At least by default, for the first couple
    fsaa = 0 ; 
    cull = false ;
    decals = false ; 
    frustum = false ; 
    // > Set sizes
    posSize = 0 ; 
    colorSize = 0 ; 
    texSize = 0 ; 
    ptSize = 0 ; 
}

void dataState::saveImage(){
    (*img).save("./outputs/test.png") ;
    return ;
}

vecState::vecState(){
    return ;
}

// > No div W for color, no texture
void vecState::populateSimple(int offset, const dataState & state){
    //printf("Entered populateSimple : offset : %d  \n", offset) ; // > DEBUG 
    //int size = (int)((state.posVecW).size()) ; // DEBUG
    //printf("Posvec size : %d \n", size) ; //DEBUG
    
    pos = state.posVecW[offset] ;
    //printf("test \n") ;
    color = state.colorVec[offset] ;
}

// > Basic line parsing for multiple coordinates
std::vector< std::vector<double> > parseNumberLine(int coordSize, int stringOffset, std::string curLine){
    std::vector< std::vector<double> > returnVector ; 
    std::vector<double> saveVector ; 
    std::vector<double> curVector ; 
    std::string subString ;
    char curChar ;

    // > Parse data
    int it = stringOffset ; // > Track how far into string we are
    bool seen = false ; // > Track number of non space characters we have seen
    curChar = curLine[it] ; // > 
    while(curChar != '\0'){
        curChar = curLine[it] ; it ++ ; 
        if(curChar == ' '){ // We've reached a space
            if(curLine[it - 2] == ' '){ continue; } // > If simply stepping through spaces, get next char
            else{ // > we have reached the end of a number
                if(!seen){seen = true ; continue ;}
                // printf("substring to stod : %s \n", subString.c_str()) ; //!!DEBUG
                saveVector.push_back(std::stod(subString)) ;
                subString.clear() ; // > Clear substring 
                continue ;
            }   
        }
        subString += curChar ;
    }
    saveVector.push_back(std::stod(subString)) ;
    
    // > Organize data
    for(int i = 0 ; i < saveVector.size() ; i ++) {
        curVector.push_back(saveVector[i]) ;
        if(((i + 1) % coordSize) == 0 ){
            returnVector.push_back(curVector) ; 
            curVector.clear() ; 
        }
    }
    // printVecNest(returnVector) ; // !!DEBUG!!

    return returnVector ; 
}

int parseFile(std::string filepath){
    // Create state variable - - - 
    dataState curDS ; // > Current data state variable

    // Read file - - -
    std::ifstream dataFile(filepath) ; 
    if(!dataFile.is_open()){
        // printf("Invalid File Path Input \n") ;  
        return -1 ; // > Path error
    }

    // Establish String and substring for parsing - - - 
    std::string curLine ; 
    std::string subString ; 
    char curChar ;
    int it = 0 ;

    // Get base PNG dimensions and name - - -
    std::getline(dataFile, curLine) ;
    subString = curLine.substr(0, 3) ; // "png"
    if(subString != "png"){return -2 ;} // > Format error

    // Extract Width and Height - - - 
    // NOTE : Non inclusive end points- note this
    // > Extract width
    it = 4 ; // Set iterator to be after png keyword
    curChar = curLine[it] ; // > Initialize or errors
    subString.clear() ;
    while(curChar != '\0'){
        curChar = curLine[it] ;
        subString += curChar ;
        it ++ ; 
        if(curChar == ' '){break ;} 
    }
    // printf("CurString: %s \n", subString.c_str()) ; //!!DEBUG!!
    curDS.wPix = std::stoi(subString) ;
    // > Extract height
    subString.clear() ;
    while(curChar != '\0'){
        curChar = curLine[it] ; 
        subString += curChar ;
        it ++ ; 
        if(curChar == ' '){break ;} 
    }
    curDS.hPix = std::stoi(subString) ;

    // Extract PNG Name - - - 
    curChar = curLine[it]; 
    subString.clear() ; 
    while(curChar != '\0'){ // NOTE : Go until string delimiter, not '\n' char
        curChar = curLine[it] ; 
        it ++ ; 
        if(curChar == ' '){continue ; }
        subString += curChar ; 
    }
    curDS.filename = subString ;
    
    // > Allocate space for PNG
    curDS.img = new Image(curDS.wPix, curDS.hPix) ; // Just to keep it dynamic, I think this needs to be a poitner, as image has no default constructor


    // > Main Data Retrieval Loop
    // - - - - - - - - - - - - - - - - - - -
    // struct vertexAttributes curVXAT ; 
    std::vector<std::vector<double>> dataVector ; // for storing space separated values neatly
    int kMod = 0 ; // > Keyword modifier
    int kMod2 = 0 ; // > Potential other keyword modifier
    // clearVXAT(curVXAT) ; // > Pass by reference
    
    while(std::getline(dataFile, curLine)){

        // > POSITION
        if(curLine.substr(0,8) == "position"){
            //printf("Entered Position\n") ; //!!DEBUG
            // Find size
            kMod = std::stoi(curLine.substr(9,10)) ; 
            // printf("kmod = %d\n", kMod) ; //!!DEBUG
            curDS.posSize = kMod ;
            dataVector = parseNumberLine(kMod, 10, curLine) ; 
            // > Place data into position vector
            curDS.posVec = dataVector ;
            //printf("Completed Position\n") ; //!!DEBUG
            continue ;
        }

        // > COLOR
        if(curLine.substr(0,5) == "color"){
            //printf("Entered Color \n") ; //!!DEBUG
            kMod = std::stoi(curLine.substr(6,7)) ;
            curDS.colorSize = kMod ; 
            dataVector = parseNumberLine(kMod, 7, curLine) ;
            //printf("Completed Color\n") ;//!!DEBUG
            curDS.colorVec = dataVector ; 
            continue ;
        }

        // > TEXCOORD
        if(curLine.substr(0,8) == "texcoord"){
            continue ;
        }

        // > POINTSIZE
        if(curLine.substr(0,9) == "pointsize"){
            continue ;
        }

        // > ELEMENTS
        if(curLine.substr(0,8) == "elements"){
            continue ;
        }

        // > DRAWARRAYSTRIANGLES
        if(curLine.substr(0,19) == "drawArraysTriangles"){
            kMod = std::stoi(curLine.substr(20, 21)) ; // Offset
            kMod2 = std::stoi(curLine.substr(22, 23)) ; // Count
            // printf("Breakpoint 1 \n") ; //!!DEBUG
            printf("kmod first : %d kmod2 count : %d \n ", kMod, kMod2) ;
            drawArraysTrianglesBasic(kMod, kMod2, curDS) ; 
            // printVecNest(curDS.posVecW) ;
            continue ;
        }

        // > DRAWELEMENTSTRIANGLES
        if(curLine.substr(0,22) == "drawElementsTriangles"){
            continue ;
        }

        // > DRAWARRAYPOINTS
        if(curLine.substr(0,17) == "drawArraysPoints"){
            continue ;
        }
        
        continue ;

    }

    printf("reached end \n") ;
    dataFile.close() ;
    // printVecNest(curDS.posVec) ;
    // printf("colors : \n") ; 
    // printVecNest(curDS.colorVec) ;
    curDS.saveImage() ;
    // free(curDS.img) ;// > This should work
    return 0 ; 
}


