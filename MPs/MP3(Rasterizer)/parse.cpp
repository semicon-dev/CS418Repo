#include "parse.h"
#include "operations.h"
#include <string>
// Functions for imgData class

// > Constructor
dataState::dataState(){
    
    // > Set state
    depth = false ;
    sRGB = true ;
    hyp = true ; 
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

// > Basic line parsing for multiple coordinates
std::vector< std::vector<double> > parseNumberLine(int coordSize, int stringOffset, std::string curLine){
    std::vector< std::vector<double> > returnVector ; 
    std::vector<double> saveVector ; 
    std::vector<double> curVector ; 
    std::string subString ;
    char curChar ;

    // > Parse data
    int it = stringOffset ; // > Track how far into string we are
    int numberCount = 0 ; // > Track number of non space characters we have seen
    curChar = curLine[it] ; // > 
    while(curChar != '\0'){
        curChar = curLine[it] ; it ++ ; 
        if(curChar == ' '){ // We've reached a space
            if(curLine[it - 2] == ' '){ continue; } // > If simply stepping through spaces, get next char
            else{ // > we have reached the end of a number
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
    dataState curDS ;

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
    struct vertexAttributes curVXAT ; 
    std::vector<std::vector<double>> dataVector ; // for storing space separated values neatly
    int kMod = 0 ; // > Keyword modifier
    int kMod2 = 0 ; // > Potential other keyword modifier
    clearVXAT(curVXAT) ; // > Pass by reference
    
    while(std::getline(dataFile, curLine)){

        // > POSITION
        if(curLine.substr(0,8) == "position"){
            // Find size
            kMod = std::stoi(curLine.substr(9,10)) ; 
            curDS.posSize = kMod ;
            dataVector = parseNumberLine(kMod, 10, curLine) ; 
            // > Place data into VXAT in curDS
            continue ;
        }

        // > COLOR
        if(curLine.substr(0,5) == "color"){
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

    
    dataFile.close() ;
    return 0 ; 
}


