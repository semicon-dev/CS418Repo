// >  Library includes
#include <cstdio>
#include <vector>
#include <string>


// > Other includes - - - 
#include "uselibpng.h"
#include "parser.h"

// > Begin Main - - - 
int main(int argc, char* argv[]){

    // > printf("Num args : %d \n", argc) ; // > DEBUG ~~
    if(argc != 2){printf("Wrong number of args \n") ; return 0;}

    // > Parse command line arguemnts
    std::string filepath = argv[1] ;

    // >  printf("Testing : %s \n", filename.c_str()) ; // > ~~DEBUG~~

    // > Parse File
    imgData data = iLoveParsingFiles(filepath) ; 
    // >Ok, lets see if we can retrieve position data
    printf("Returned from parsing \n") ; 
    printf("POSITION TEST \n") ;
    for(int i = 0 ; i < data.posVec.size() ; i ++){
        printf("%d ", data.posVec[i]) ; 
    }
    printf("\n") ; 

    printf("COLOR TEST\n") ;
    for(int i = 0 ; i < data.colorVec.size() ; i ++){
        printf("%d ", data.colorVec[i]) ; 
    }
    printf("\n") ;

    printf("NUMPIX : %d \n", data.n) ; 



    return 0 ;
}

