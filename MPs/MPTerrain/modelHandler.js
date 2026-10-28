
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
            , // color
            [[0,0,0]
            ,[1,1,1]
            ,[0,1,0]
            ,[1,0,1]
            ,[0,0,1]
            ,[0,1,1]
            ]
        ]
    }

    

    var tet =
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

    // > Function for generating grid of gridsize
    function makeGrid(gridSize){
        let n = gridSize ;
        // create grid object
        const grid = {
            "triangles" : [] // > Push 3 vertex num vectors here
            ,"attributes" : [[]] // > Push 3 element positions here // >attributes must be 2d
        } // This double thing is IMPERATIVE to eventualy add normals as an attribute

        // > Create Triangles for Grid
        for(let i = 0 ; i < n*n ; i+= 1 ){
            // > Push triangle vertices - - -
            if((i % n) == 0){ // > Case that we are on an edge
                continue ;
            }
            if(i >= (n)*(n-1)){ // > Case we are on the bottom row 
                break ; 
            }
            // > Else
            grid.triangles.push([i, i - 1, i + n - 1])
            grid.triangles.push([i, i + n - 1, i + n ])
        }
        if(n <= 1){
            n = 2 ; // > Prevent div by zero
        }
        let offset = 2 / (n-1) ; 
           // console.log("offset")
          //  console.log(offset)
        // let curX = -1 ; // xMax = 1
        // let curY = -1 ; // yMax = 1
        // for(let i = 0 ; i < n*n ; i+= 1 ){
        //     grid.attributes[0].push([curX, curY, 0]) ;
        //     curX += offset ; 
        //     // > Check if we have reached the edge
        //     if(curX > 1){
        //         curY += offset ;
        //         curX = -1 ; 
        //     }

        // }

        // ^^ Above does not work as well!!

        // > Compute differently, so as to not accumulate floating point errors - - -
        for(let numRow = 0 ; numRow < n ; numRow += 1){
            for(let numCol = 0 ; numCol < n ; numCol += 1){
                grid.attributes[0].push([
                 -1 + offset * numRow, -1 +offset * numCol, 0
                ])
            }
        }

        return grid ;
    }

    function makeTerrain(faults){
        let terrain = structuredClone(window.gridObj) ; // had to look this one up.
        let n = terrain.attributes[0].length
        // > Case that number of faults = 0 
        // - - - - - - - - - - - - - - - - -
        // > Need to go through and change, \forall vertices, the z height of terrain object
        if(faults === 0){
            let dist_from_center = 0 ; // > Log distance from cetner
            let r = 1 ; // > Consider the "radius" of our square to be 1
            for(let i = 0 ; i < n ; i = i + 1){ // > Forall vertices
                dist_from_center = mag(terrain.attributes[0][i]) ; // Get cur dist away (z should always be 0 in grid)
                if(dist_from_center < r){
                    terrain.attributes[0][i][2] = Math.sqrt(1 - dist_from_center * dist_from_center)
                }
            }

            
        }
        else{
            let p = [0,0] ; // random point to be chosen
            let theta = 0 ; //random direction we have chosen
            let n = [0,0]
            let testDelta = .125 ; // amount to raise /lower terrain by
            let measure = 0 ;
            

            for(let i = 0 ; i < faults ; i += 1){ // > Apply another number of random faults
                theta = Math.random() * 2 * 3.14159 ; 
                p[0] = Math.random() * 2 + -1; 
                p[1] = Math.random() * 2 + -1; 

                n[0] = Math.cos(theta) ; 
                n[1] = Math.sin(theta) ; 
                //console.log("theta",theta) // > Debug
                //console.log("point", p)

                // Create the fault now!!!!!
                // > Iterate over all the possible points
                for(let i = 0 ; i < terrain.attributes[0].length ; i = i + 1){
                    measure = dot(sub([terrain.attributes[0][i][0], terrain.attributes[0][i][1]], p), n) // > Measure whether to raise or lower
                if(measure > 0){ // > Raise
                    terrain.attributes[0][i][2] += testDelta ;
                } else{ // > Lower
                    terrain.attributes[0][i][2] -= testDelta ;
                }
                
                }
               

            }
        }

        return terrain ; 
    }


