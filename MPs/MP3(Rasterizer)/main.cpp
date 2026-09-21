#include "parse.h"

int main(int argc, char* argv[]){

    // > printf("Num args : %d \n", argc) ; // > DEBUG ~~
    if(argc != 2){printf("Wrong number of args \n") ; return 0;}

    // > Parse command line arguemnts
    std::string filepath = argv[1] ;

    // >  printf("Testing : %s \n", filename.c_str()) ; // > ~~DEBUG~~

    // > Parse File
    int cumfuck = parseFile(filepath) ; 
    if(cumfuck != 0){
        printf("Idk but you fucked up lol \n") ; 
    }


    return 0 ;
}

