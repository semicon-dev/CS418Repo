var octCol = {"triangles":
        [[0,1,2]
            , [0,2,3]
            , [0,3,4]
            , [0,4,1]
            , [5,1,4]
            , [5,4,3]
            , [5,3,2]
            , [5,2,1]
        ]
    ,"attributes":
        [ // position
            [[1,0,0]
            ,[0,1,0]
            ,[0,0,1]
            ,[0,-1,0]
            ,[0,0,-1]
            ,[-1,0,0]
            ]      
            , // color
            [[0.9,0,0.7]
            ,[1,1,1]
            ,[0,1,0.3]
            ,[0.2,0,0.9]
            ,[0.5,0.3,1]
            ,[0,1,1]
            ]
        ]
    }

// > Test Models - - - 
var tetrahedron =
    {"triangles":
        [4,5,6
        ,1,2,3
        ,2,3,0
        ,3,0,1
        ]
    ,"attributes":
        [ // position
            [[-0.5,-0.5,-0.5]
            ,[ 0.5, 0.5,-0.5]
            ,[-0.5, 0.5, 0.5]
            ,[ 0.5,-0.5, 0.5]
            ,[-0.5,-0.5,-0.5]
            ,[ 0.5, 0.5,-0.5]
            ,[-0.5, 0.5, 0.5]
            ]
        , // color
            [[0,0,0]
            ,[1,1,1]
            ,[0,1,0]
            ,[1,0,1]
            ,[0,0,1]
            ,[0,1,1]
            ,[1,0,1]
            ]
        ]
    }

var unitGridTest = 
    {"triangles":
        [0,1,2
        ,1,2,3

        ]
    ,"attributes":
        [ // position
            [[-1,-1,0 ] 
            ,[ 1, -1,0]
            ,[-1, 1,0 ]
            ,[ 1,1,0  ]
            ]
            , // color
            [
             [0,0,0]
            ,[1,1,1]
            ,[0,1,0]
            ,[1,0,1]
            ]
        ]
    }

var oct = {"triangles":
        [[0,1,2]
            , [0,2,3]
            , [0,3,4]
            , [0,4,1]
            , [5,1,4]
            , [5,4,3]
            , [5,3,2]
            , [5,2,1]
        ]
    ,"attributes":
        [ // position
            [[1,0,0]
            ,[0,1,0]
            ,[0,0,1]
            ,[0,-1,0]
            ,[0,0,-1]
            ,[-1,0,0]
            ]      
        ]
    }

    

    var tet =
    {"triangles":
        [[0,1,2]
        ,[1,2,3]
        ,[1,3,0]
        ,[0,2,3]
        ]
    ,"attributes":
        [ // position
            [[-0.5,-0.5,-0.5]
            ,[ 0.5, 0.5,-0.5]
            ,[-0.5, 0.5, 0.5]
            ,[ 0.5,-0.5, 0.5]
            ,[-0.5,-0.5,-0.5]
            ,[ 0.5, 0.5,-0.5]
            ,[-0.5, 0.5, 0.5]
            ]
        ]
    }


    var unitGridTest2 = 
    {"triangles":
        [0,1,2
        ,1,2,3

        ]
    ,"attributes":
        [ // position
            [[-1,-1,0 ] 
            ,[ 1, -1,0]
            ,[-1, 1,0 ]
            ,[ 1,1,0 ]
            ]
            , // color
            [
             [0,0,0]
            ,[1,1,1]
            ,[0,1,0]
            ,[1,0,-2]
            ]
        ]
    }

    async function parseObject(filePath){
        let obj = {
            "triangles" : [] // > Push 3 vertex num vectors here
            ,"attributes" : [[]] // > Push 3 element positions here // >attributes must be 2d
        }  // This double thing is IMPERATIVE to eventualy add normals as an attribute
        obj.attributes[0].push([0,0,0]) // vertices
        obj.attributes.push([])
        obj.attributes[1].push([0,0,0]) // > always add colors

       // > Need this for colors obj.attributes.push([]) // > For colors
        // obj.attributes[0].push([0,0,0]) // colors
        // Ok we have the fileData in, write the shitass parser - - -
        let fileData = await fetch(filePath).then(r => r.text())
        // > lets check if we can parse this like a string
        let lines = fileData.split(/\r?\n/); // split with newline and other weird things for windows (had to look this one up)
        let lineNumber = lines.length  ; 
       //  console.log(lineNumber)
        // > Loop over each lines - - - 
        
        // > Note we may need to set colors
        let colorSet = false ;
        for(let i = 0 ; i < lineNumber ; i += 1){
            // let curChar = lines[i][0] // > get first char
            

            let lItems = lines[i].split(/\s+/) // > way easier than manaul parsing - line items
            
            // > Add more conditionals as we expand this - - -
            // > Handle vertices

            // > Note we may need to setcolor
            
            if(lItems[0] === "v"){ // > vertex 
                // > Check if object has coloring
                // > Push back to attributes
                // > Check if we have colors
                
                
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){
                        if(lItems[k] != ""){ // > Skip white space directive
                            tempArr.push(Number(lItems[k]))
                        }
                    }

                    obj.attributes[0].push([tempArr[0], tempArr[1], tempArr[2]]) // > Vrtices push

                 // case colors
                if(tempArr.length > 4){
                    colorSet = true
                    obj.attributes[1].push([tempArr[3], tempArr[4], tempArr[5]])
                } else{
                    obj.attributes[1].push([0.7, 0.8, 0.9])// > Push this color here
                }
            }
        

            // > Handle faces
            if(lItems[0] === "f"){ // > Faces
                let tempArr = []
                for(let k = 1 ; k < lItems.length ; k += 1){
                    if(lItems[k] != ""){
                        tempArr.push(Number(lItems[k]))
                    }
                }
                obj.triangles.push(tempArr)
            }
        }
    
        // console.log(obj.triangles)
        // console.log(obj.attributes)
        // console.log(obj.attributes.length)
        // > Check if we need to resize object by checking the largest dimension / vertex position
        // > Find max point separation - cannot think of any possible way to do this other than O(n^2)
        // without some serious thinking about it. Luckily, no points taken off for unoptimal alogirthms!

        // > Before max dist lets center the object ! 
        let runningSum = [0,0,0] 
        for(let i = 1 ; i < obj.attributes[0].length ; i += 1 ){
            runningSum = add(runningSum, obj.attributes[0][i])
        }
        let avg = div(runningSum, obj.attributes[0].length - 1)
        console.log(avg)
        // > Subtract from every vertex to find vetner
        for(let i = 1 ; i < obj.attributes[0].length ; i += 1 ){
            obj.attributes[0][i] = sub(obj.attributes[0][i], avg)
        }


        let maxDist = 0 ;
        for(let i = 1 ; i < obj.attributes[0].length ; i += 1 ){
            for(let j = 1 ; j < obj.attributes[0].length ; j += 1){
                // console.log(obj.attributes[0][i], obj.attributes[0][j])
                if(mag(sub(obj.attributes[0][i], obj.attributes[0][j])) > maxDist){
                    maxDist = mag(sub(obj.attributes[0][i], obj.attributes[0][j])) ; // > Largest distance
                }
            }
        }
        for(let i = 1 ; i <obj.attributes[0].length ; i += 1){
            obj.attributes[0][i] = div(obj.attributes[0][i], maxDist)
            obj.attributes[0][i] = mul(obj.attributes[0][i], 2.5)
        }

        globColorFlag = colorSet ;
        return obj ;
    }

    function geomLoaded(geometry){
      addNormals(geometry)
      window.geom = setupGeometry(geometry)
    }



    // ParseObject 2 - - -

//     function parseObject2(filePath){
//         let obj = {
//             "triangles" : [] // > Push 3 vertex num vectors here
//             ,"attributes" : [[]] // > Push 3 element positions here // >attributes must be 2d
//         }  // This double thing is IMPERATIVE to eventualy add normals as an attribute
//         obj.attributes[0].push([0,0,0]) // vertices

//         obj.attributes.push([]) // > Colors
//         obj.attributes[1].push([0,0,0]) 

//         obj.attributes.push([]) // > Textures
//         obj.attributes[2].push([0,0,0]) 

//         obj.attributes.push([])  // > Normals (always in slot 3)
//         obj.attributes[3].push([0,0,0]) 

//         // > Get lines
//         let fileData = await fetch(filePath).then(r => r.text())
//         let lines = fileData.split(/\r?\n/) ; 
//         let numLines = lines.length  ; 

//         // > Initialize arrays
//         let tempVertices = []
//         let tempColors = []
//         let tempTextures  = []
//         let tempNormals = []
//         // > Flags for communication
//         let texFlag = false
//         let normFlag = false
//         let colFlag = false

//         for(let lnIdx = 0 ; lnIdx < numLines ; lnIdx += 1){ // > Iterate through all lines

//             let lItems = lines[lnIdx].split(/\s+/) // > Each item in our line (space separated)
//             // > Vertex Position and Color
//             if(lItems[0] === "v"){
//                 let tempArr = []
//                     for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
//                         if(lItems[k] != ""){ // > Skip white space
//                             tempArr.push(Number(lItems[k]))
//                         }
//                     }
//                 tempVertices.push(tempArr[0], tempArr[1], tempArr[2]) // > Push positions
//                 if(tempArr.length > 3){ // > Color case
//                     colFlag = true ;
//                     tempColors.push(tempArr[3], tempArr[4], tempArr[5])
//                 } else{
//                     tempColors.push(0.7, 0.7, 0.7) // > Push gray
//                 }
                
                    
//             }


//             // > Vertex Textures Coords
//             if(lItems[0] === "vt"){
//                 texFlag = true ; // > Set flags to return globally
//                 let tempArr = []
//                     for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
//                         if(lItems[k] != ""){ // > Skip white space
//                             tempArr.push(Number(lItems[k]))
//                         }
//                     }
//                     tempTextures.push(tempArr[0], tempArr[1])
//             }


//             // > Vertex Normals
//             if(lItems[0] === "vn"){
//                 normFlag  = true ; 
//                 let tempArr = []
//                     for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
//                         if(lItems[k] != ""){ // > Skip white space
//                             tempArr.push(Number(lItems[k]))
//                         }
//                     }
//                     tempNormals.push(tempArr[0], tempArr[1], tempArr[2])
//             }



//             // > Faces
//             if(lItems[0] === "f"){
//                 // > Note additional parsing to assemble triangles
//                 let tempArr = [] // > Push face data here
//                 for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
//                         if(lItems[k] != ""){ // > Skip white space
//                             tempArr.push(lItems[k]) // > Do not convert to number
//                         }
//                 }

//                 for(let k = 0 ; k < tempArr.length ; k += 1){ // > For every face data point
//                     let curFace = tempArr[k]
//                     let faceData = tempArr.split("/") // >  Split based on slashes
//                     console.log(faceData)
//                     // > Add vertices and colors

//                     // > Add textures

//                     // > Add normals

//                 }

//             }


//         }


//         return obj ;

// }