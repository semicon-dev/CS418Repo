// >  Library includes
#include <cstdio>
#include <vector>
#include <string>


// > Other includes - - - 
#include "uselibpng.h"
#include "parser.h"

// > Helper function for debugging

// > Helper - - - 
// void printImageData(int width, int height, Image printImg){
//     for(int i = 0 ; i < width; i ++){
//         for(int j = 0 ; j < height ; j ++){
//             printf("%d ", printImg[j][i].red) ; 
//             printf("%d ", printImg[j][i].green) ; 
//             printf("%d ", printImg[j][i].blue) ; 
//             printf("%d ", printImg[j][i].alpha) ; 
//             printf("| ") ; 
//             printImg.
//         }
//     }
// }

// > Ok Lets make the write image file - - -

int createImage(imgData data){
    printf("Entering createImage \n") ; 
    if(data.w == 0 || data.h == 0){return 1 ; } // Image size wrong
    Image newImg = Image(data.w, data.h) ; 
    int prevNum ; // > For storing the last number of points written
    // > Check data formatting
    if((data.posVec.size() % 2) != 0){return 2 ; } // Size format error
    if((data.colorVec.size() % 4) != 0 ){return 3 ; } // Color format error
    for(int j ; j < data.nVec.size() ; j ++){
        for(int i = 0 ; i < data.nVec[j] ; i ++){
            int& posX = data.posVec[i*2 + prevNum*2] ; 
            int& posY = data.posVec[i*2 + 1 + prevNum*2] ;
            newImg[posY][posX].red = data.colorVec[i*4] ; 
            newImg[posY][posX].green = data.colorVec[i*4+1] ; 
            newImg[posY][posX].blue = data.colorVec[i*4+2] ; 
            newImg[posY][posX].alpha = data.colorVec[i*4+3] ; 
        }
        prevNum = data.nVec[j] ; 
    }
    // printImageData(data.w, data.h, newImg) ; / > TS doesn't work. I cant seem to access pixel values
    newImg.save(data.imgName.c_str()) ; 

    return 0 ; 
}




// > Begin Main - - - 
int main(int argc, char* argv[]){

    // > printf("Num args : %d \n", argc) ; // > DEBUG ~~
    if(argc != 2){printf("Wrong number of args \n") ; return 0;}

    // > Parse command line arguemnts
    std::string filepath = argv[1] ;

    // >  printf("Testing : %s \n", filename.c_str()) ; // > ~~DEBUG~~

    // > Parse File
    imgData data = iLoveParsingFiles(filepath) ; 

    if(data.errorCode == 1){
        printf("Path error/cannot find file : Terminating \n") ;
        return 0 ;
    }
    if(data.errorCode == 2){
        printf("File Format Error : Terminating \n") ;
        return 0 ;
    }

    // TESTING - - - -
    
    // printf("Returned from parsing \n") ; 
    // printf("POSITION TEST \n") ;
    // for(int i = 0 ; i < data.posVec.size() ; i ++){
    //     printf("%d ", data.posVec[i]) ; 
    // }
    // printf("\n") ; 

    // printf("COLOR TEST\n") ;
    // for(int i = 0 ; i < data.colorVec.size() ; i ++){
    //     printf("%d ", data.colorVec[i]) ; 
    // }
    // printf("\n") ;

    // printf("NUMPIX : %d \n", data.n) ; 

    // END TESTING - - --


    // > Create the image
    int retVal = createImage(data) ; 


    return 0 ;
}

