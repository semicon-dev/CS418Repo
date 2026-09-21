#include "parser.h"
#include <cstdio>
// #include <iostream>
#include <string>

// Functions for imgData class

// > Constructor
imgData::imgData(){
    // printf("imgData Constructor Called \n") ; 

     
    errorCode = 0 ; 
    /* 
    0 no error
    1 path error
    2 format error
    */
    return ; 
}

// > Return Color Vector
std::vector<int> imgData::getColor(int i){
    std::vector<int> retVec ;
    int offset = i*3 ; 
    for(int j = 0 ; j < 3 ; j ++){ 
        retVec.push_back(colorVec[offset + j]) ; 
    }
    return retVec ; 
}
// > Return Position Vector
std::vector<int> imgData::getPos(int i){
    std::vector<int> retVec ;
    int offset = i*2 ; 
        for(int j = 0 ; j < 2 ; j ++){
        retVec.push_back(posVec[offset + j]) ; 
    }
    return retVec ; 
}

// > Parsing function
imgData iLoveParsingFiles(std::string filepath){
    // > Init to be returned
    imgData retData = imgData() ; 
    // > Open file
    std::ifstream data_file(filepath) ; 
    if(!data_file.is_open()){
        printf("Invalid File Path Input \n") ; 
        retData.errorCode = 1 ; 
        return retData ;
    }
    // > Parse file
    // - - - - - - 
    std::string curLine ; 
    std::string subString ; 
    char curChar ;
    // > Flags
    int strCount = 0 ; 
    //bool pngSeenFlag = 0 ;
    while(std::getline(data_file, curLine)){
        strCount ++ ; 

        // > Check for PNG init line
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        if(strCount == 1){
            // > Extract "PNG"
            subString = curLine.substr(0, 3) ; 
            // printf("PNG : %s \n", subString.c_str()) ; //~~DEBUG~~
            if(subString != "png"){retData.errorCode = 2 ; return retData ;}

            // > Extract Width and Height
            subString = curLine.substr(4,5) ; // > Non inclusive end points- note this
            retData.w = std::stoi(subString) ; 
            subString = curLine.substr(6,7) ; 
            retData.h = std::stoi(subString) ; 
            // printf("W = %d, H = %d \n", retData.w, retData.h) ; //~~DEBUG~~

            // > Extract PNG Name
            int it = 8 ; 
            curChar = curLine[it]; 

            // printf("TESTING CURCHAR : %c \n", curChar) ; // > DEBUG~~

            subString.clear() ; // > Clear string before writing to it
            while(curChar != '\0'){ // > Go until string delimiter, not '\n' char
                // printf("DEBUG : %d \n", it) ; // > DEBUG~~
                curChar = curLine[it] ; 
                it ++ ; 
                if(curChar == ' '){continue ; }
                subString += curChar ; 
            }
            // > Ok we've got the name
            retData.imgName = subString ; 
            // printf("PNG NAME : %s \n", subString.c_str()) ;  // > DEBUG~~
            continue ; 
        }
        // > Check for other keywords
        
        // > Populate Position Vector
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        if(curLine.substr(0, 10) == "position 2"){
            // > Start now, at position 11, and begin parsing numbers
            int it = 11 ; 
            curChar = curLine[it] ; 
            subString.clear() ; 
            while(curChar != '\0'){
                curChar = curLine[it] ; 
                it ++ ; 
                if(curChar == ' '){ // > If we hit a space
                    retData.posVec.push_back(std::stoi(subString)) ; // > Write int to vector
                    subString.clear() ; 
                    continue ; 
                }
                subString += curChar ; 
            }
            retData.posVec.push_back(std::stoi(subString)) ; // > Write int to vector

            continue ; 
        }

        // > Populate Color Vector
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        if(curLine.substr(0, 7) == "color 4"){
            // > Start now, at position 11, and begin parsing numbers
            int it = 8 ; 
            curChar = curLine[it] ; 
            subString.clear() ; 
            while(curChar != '\0'){
                curChar = curLine[it] ; 
                it ++ ; 
                if(curChar == ' '){ // > If we hit a space
                    retData.colorVec.push_back(std::stoi(subString)) ; // > Write int to vector
                    subString.clear() ; 
                    continue ; 
                }
                subString += curChar ; 
            }
            retData.colorVec.push_back(std::stoi(subString)) ; // > Write int to vector
            continue ; 
        }

        // > Update NumPixel2Draw BROCHACHO
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        // - - - - - - - -  - - - - - - - - - - - - -  - - - - - 
        if(curLine.substr(0, 10) == "drawPixels"){
            int it = 11 ; 
            curChar = curLine[it] ; 
            subString.clear() ; 
            while(curChar != '\0'){
                curChar = curLine[it] ; 
                it ++ ; 
                if(curChar == ' '){continue ;}
                subString += curChar ;
            }
            retData.nVec.push_back(std::stoi(subString)) ; 
            
            continue ; 
        }
        
    }

    // > Close file
    data_file.close() ; 

    return retData ; 
}