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
            let delta = .25 ; // amount to raise /lower terrain by
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


function applyWeathering(smoothingFactor) {
    let s = smoothingFactor ; 

    // > Note - should this be a destructive process - eg we can't "unweather?"
    // > Yes, averaging is a fundamentally destructive operation, also note I will need to make a terrain copy
    // > No, we should keep a copy of the original, non weathered grid, but only make the weathered one

    // > Ok terrainWeathered is currently a structed clone of our terrain object - - -
    console.log(s)
    // > We now need to go through every vertex of our normal terrain and apply weathering to terrain
    let n = terrainObj.attributes[0].length // > gridsize squared
    let sz = Math.sqrt(n) ; // > Should give us the size of our actual grid

    if(smoothingFactor = 0 ){ // > Return to unweathered terrain
        terrainWeathered = structuredClone(terrainObj) //!! This whole block might be unecessary - - -
        return ; // > Who care tho, if causes issues / doesn't change operation in the future I will get rid of it
    }

    // > Repeat smoothing smoothingFactor number of times
    for(let i = 0 ; i < s ; i += 1) {
        let prevTerrain = structuredClone(terrainWeathered) // > Get a structured clone to index, then modify current terrainWeathered
        for(let curRow = 0 ; curRow < sz ; curRow += 1){
            for(let curCol = 0 ; curCol < sz ; curCol += 1){
                // > Get values of current and surrdouning vertices
                let curV = prevTerrain.attributes[0][curCol + sz*curRow] ;
                
                // > Now get other indices
                
                // Right
                let sum = 0 ; 
                let validV = 0 ; 
                if(curCol < 49){
                    validV += 1 ;
                    sum += prevTerrain.attributes[0][curCol + 1 + sz*curRow][2] ;
                }
                // Left
                if(curCol > 0 ){
                    validV += 1 ; 
                    sum += prevTerrain.attributes[0][curCol -1 + sz*curRow][2] ;
                }

                // Up
                if(curRow > 0){
                    validV += 1 ; 
                    sum += prevTerrain.attributes[0][curCol + sz*(curRow  - 1)][2] ;

                }

                // Down
                if(curRow < 49){
                    validV += 1 ; 
                    sum += prevTerrain.attributes[0][curCol + sz*(curRow  + 1)][2] ;

                }
                // > Get adjacent average 
                let adjAv = sum / validV
                let newVal = (adjAv + curV[2]) / 2
                terrainWeathered.attributes[0][curCol + sz*curRow][2] = newVal ; 
            }
        }
        
    }
}