
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


        // > Compute differently, so as to not accumulate floating point errors - - -
        for(let numRow = 0 ; numRow < n ; numRow += 1){
            for(let numCol = 0 ; numCol < n ; numCol += 1){
                grid.attributes[0].push([
                -1 + offset * numRow,
                -1 + offset * numCol,
                0
                ])
                /**
                 * Initilally I tried swapping row and col to fix lerping,
                 * but it screwde up the handedness and lighting, so Ill just
                 * need to index differently!
                 */
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
            let delta = 10 ; // amount to raise /lower terrain by
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
                    terrain.attributes[0][i][2] += delta ;
                } else{ // > Lower
                    terrain.attributes[0][i][2] -= delta ;
                }

                }
               
            }

                // Handle height normalization - - - 
                let h_max = 0 ; 
                let h_min = 0 ; 
                let heights = [] ; 
                let peak = 1.0 ; 
                // get all heights
                for(let i = 0 ; i < terrain.attributes[0].length ; i = i + 1){
                    heights.push(terrain.attributes[0][i][2]) ; 
                }
                // console.log("heights", heights)
                h_max = Math.max(...heights)
                h_min = Math.min(...heights)
                // console.log("max", h_max)
                // console.log("min", h_min)

                for(let i = 0 ; i < terrain.attributes[0].length ; i = i + 1){
                    terrain.attributes[0][i][2] = peak * (terrain.attributes[0][i][2] - .5 * (h_max + h_min)) / (h_max - h_min)
                }
        }

        return terrain ; 
    }


    function getTerrainHeight(){
        
        /* General rambling on how to solve this problem  - - -
            > Would it be more intelligent to transform our grid back as a copy and use that here?
            > Find terrain height at this point -
            > Ok what do we need -
            > We need our position in OBJECT coordinates!!!!!
            > Note that we using the m4rotx to turn our object coords in WORLD coords.
            > Must we then apply the inverse of the transform to our eye position to turn it into obj coords?
            > I suppose we might - - - -
            > Rotate our current position 90 degrees (pi/2) arround the x axis

        */
        let worldToObj = m3rotX(Math.PI / 2)
        let objPos = m3mul(worldToObj, eye_position) // > Let's see if this is correct!

        // console.log(objPos) // debug
        // > Next snap to inside the grid !! ADJUST LATER TO MAYBE BE LESS JARRING!!!
        if( (objPos[0] > 1) ||
            (objPos[0] < -1) ||
            (objPos[1] > 1) ||
            (objPos[1] < -1)){
            // > snap to center
            eye_position = [0,2,0]
            objPos = m3mul(worldToObj, eye_position) // !! should remove the crashing issue
            // when moving out of bounds! forgot to check this!
            // > Basically, never updated the thing that acutlaly would cause an
            // out of bounds index
        }

        // > Ok, now find where we are on the grid coords basically - - -
        // > Maybe get floor and ceiling of x and y values and just lerp them to find height?
        // > Maybe get the grid side as well as a window / global so we can ref it?
        let offset_size = 2 / (gridSizeGlob - 1) // (lenght of a grid square)
        let sz = gridSizeGlob ; // Less clutter to type
        // > want to find neighboring grid indicies

        // > Focus on finding nighboring points for x - -
        /**
         * Note that we want to map -1 to zero and 1 to 2
         **/
        let curXCoord = objPos[0] + 1 // the + 1 should complete the mapping
        let curXInt = curXCoord / offset_size // Int for intermediate
        let curX_up = Math.ceil(curXInt)
        let curX_dn = Math.floor(curXInt)
         // console.log(curX_dn, curX_up) // !!debug

        let curYCoord =  objPos[1] + 1
        let curYInt = curYCoord / offset_size
        let curY_up = Math.ceil(curYInt)
        let curY_dn = Math.floor(curYInt)
         // console.log(curX_dn, curY_ dn) //debug
        let normalizedXY = [curXInt, curYInt] // this will be handy for the LERP!!
        let fracOffset = [curXInt - curX_dn, curYInt - curY_dn]
         //  > Ok, now that we have the positions that we are in between within the grid
         // > We then need to actually get the values from the grid object to that

        // > Next task - get lerped height at position
        // > Bilinear height lerp
        
        // > Lerp over both Ys first
        // > This should work if I build my grid in an intellignet way . . . 
        // > Add well out of bounds index check
        // console.log(curXInt, curYInt) //debug!!
        if((curXInt < sz) &&
            (curXInt > 0) &&
            (curYInt < sz) &&
            (curYInt > 0) ){
        let x_dn_YLerp = lerp(fracOffset[1], terrainObj.attributes[0][curY_dn  + curX_dn * sz],
                                             terrainObj.attributes[0][curY_up  + curX_dn * sz] )
        let x_up_YLerp = lerp(fracOffset[1], terrainObj.attributes[0][curY_dn  + curX_up * sz],
                                             terrainObj.attributes[0][curY_up  + curX_up * sz] )
        let lerpedHeight = lerp(fracOffset[0], x_dn_YLerp, x_up_YLerp)[2]
        // console.log(fracOffset) //debug!!
        // let lerpedHeightDebug = terrainObj.attributes[0][curY_dn * sz + curX_dn][2] //debug!!
        // console.log(lerpedHeightDebug) //debug!!
        // console.log(lerpedHeight)
        eye_position[1] = lerpedHeight + 0.175
        }
        
        

    }