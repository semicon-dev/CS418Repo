    // prototype 1 - ParseObject 2 - - -
    // (no triangles / indices)

    async function parseObject2(filePath){
        let obj = {
            "triangles" : [] // > Push 3 vertex num vectors here
            ,"attributes" : [[]] // > Push 3 element positions here // >attributes must be 2d
        }  // This double thing is IMPERATIVE to eventualy add normals as an attribute
       // obj.attributes[0].push([0,0,0]) // vertices

        obj.attributes.push([]) // > Colors
       // obj.attributes[1].push([0,0,0]) 

        obj.attributes.push([]) // > Textures
       // obj.attributes[2].push([0,0]) // > Only two texcoords

        obj.attributes.push([])  // > Normals (always in slot 3)
       // obj.attributes[3].push([0,0,0]) 

        // > Get lines
        let fileData = await fetch(filePath).then(r => r.text())
        let lines = fileData.split(/\r?\n/) ; 
        let numLines = lines.length  ; 

        // > Initialize arrays
        let tempVertices = []
        let tempColors = []
        let tempTextures  = []
        let tempNormals = []
        // > Flags for communication
        let texFlag = false
        let normFlag = false
        let colFlag = false
        let shiftAndCenter = false
        // > Track / map faces
        let seenVertex = new Map()

        for(let lnIdx = 0 ; lnIdx < numLines ; lnIdx += 1){ // > Iterate through all lines

            let lItems = lines[lnIdx].split(/\s+/) // > Each item in our line (space separated)
            // > Vertex Position and Color
            if(lItems[0] === "v"){
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(Number(lItems[k]))
                        }
                    }
                tempVertices.push([tempArr[0], tempArr[1], tempArr[2]]) // > Push positions
                if(tempArr.length > 3){ // > Color case
                    colFlag = true ;
                    tempColors.push([tempArr[3], tempArr[4], tempArr[5]])
                } else{
                    tempColors.push([0.7, 0.7, 0.7]) // > Push gray
                }
                
                    
            }


            // > Vertex Textures Coords
            if(lItems[0] === "vt"){
                texFlag = true ; // > Set flags to return globally
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(Number(lItems[k]))
                        }
                    }
                    tempTextures.push([tempArr[0], tempArr[1]])
            }


            // > Vertex Normals
            if(lItems[0] === "vn"){
                normFlag  = true ; 
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(Number(lItems[k]))
                        }
                    }
                    tempNormals.push([tempArr[0], tempArr[1], tempArr[2]])
            }



            // > Faces
            if(lItems[0] === "f"){
                // > Center and scale
                if(shiftAndCenter === false){
                    shiftAndCenter = true ;

                    // > shift object to center
                    let runningSum = [0,0,0] 
                    for(let i = 0 ; i < tempVertices.length ; i += 1 ){
                        runningSum = add(runningSum, tempVertices[i])
                    
                    }
                    let avg = div(runningSum, tempVertices.length - 1)
                    
                    
                    for(let i = 0 ; i < tempVertices.length ; i += 1 ){
                        tempVertices[i] = sub(tempVertices[i], avg)
                    }

                    // > Scale object to fit
                    let maxDist = 0 ;
                    for(let i = 0 ; i < tempVertices.length ; i += 1 ){
                        for(let j = 0 ; j < tempVertices.length ; j += 1){
                            // console.log(obj.attributes[0][i], obj.attributes[0][j])
                            if(mag(sub(tempVertices[i], tempVertices[j])) > maxDist){
                                maxDist = mag(sub(tempVertices[i], tempVertices[j])) ; // > Largest distance
                            }
                        }
                    }
                    for(let i = 0 ; i < tempVertices.length ; i += 1){
                        tempVertices[i] = div(tempVertices[i], maxDist)
                       tempVertices[i] = mul(tempVertices[i], 2.5)
                    }
                }
                // > End shift and scale

                
                // > Note additional parsing to assemble triangles
                let tempArr = [] // > Push face data here
                for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(lItems[k]) // > Do not convert to number
                        }
                }

                for(let k = 0 ; k < tempArr.length ; k += 1){ // > For every face data point
                    let curFace = tempArr[k]
                    let faceData = tempArr[k].split("/") // >  Split based on slashes
                    // console.log(faceData)

                    // > Add vertices and colors (always)
                        let idx = Number(faceData[0]) - 1
                        
                        obj.attributes[0].push(tempVertices[idx][0], tempVertices[idx][1], tempVertices[idx][2])
                        obj.attributes[1].push(tempColors[idx][0], tempColors[idx][1], tempColors[idx][2])
                    // > Add textures
                        if(texFlag){
                            idx = Number(faceData[1]) - 1
                            obj.attributes[2].push(tempTextures[idx][0], tempTextures[idx][1])
                        } else{
                            obj.attributes[2].push(0, 0)
                        }
                    // > Add normals
                        if(normFlag){
                            idx = Number(faceData[2]) - 1
                            obj.attributes[3].push(tempNormals[idx][0], tempNormals[idx][1], tempNormals[idx][2])
                        } else{
                            obj.attributes[3].push(0,0,0) // > No normal data
                        }
                }
            }
        }


       // console.log



        // > Debugging
        // console.log(obj)
        // > End Debugging

        // > Set globalFlags
        globColorFlag = colFlag
        globTextureFlag = texFlag
        globNormalFlag = normFlag
        return obj ;

}






 // ParseObject 2 - - - prototype 2

    async function parseObject2(filePath){
        let obj = {
            "triangles" : [] // > Push 3 vertex num vectors here
            ,"attributes" : [[]] // > Push 3 element positions here // >attributes must be 2d
        }  // This double thing is IMPERATIVE to eventualy add normals as an attribute
       // obj.attributes[0].push([0,0,0]) // vertices

        obj.attributes.push([]) // > Colors
       // obj.attributes[1].push([0,0,0]) 

        obj.attributes.push([]) // > Textures
       // obj.attributes[2].push([0,0]) // > Only two texcoords

        obj.attributes.push([])  // > Normals (always in slot 3)
       // obj.attributes[3].push([0,0,0]) 

        // > Get lines
        let fileData = await fetch(filePath).then(r => r.text())
        let lines = fileData.split(/\r?\n/) ; 
        let numLines = lines.length  ; 

        // > Initialize arrays
        let tempVertices = []
        let tempColors = []
        let tempTextures  = []
        let tempNormals = []
        // > Flags for communication
        let texFlag = false
        let normFlag = false
        let colFlag = false
        let shiftAndCenter = false
        // > Track / map faces
        let seenVertex = new Map()

        for(let lnIdx = 0 ; lnIdx < numLines ; lnIdx += 1){ // > Iterate through all lines

            let lItems = lines[lnIdx].split(/\s+/) // > Each item in our line (space separated)
            // > Vertex Position and Color
            if(lItems[0] === "v"){
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(Number(lItems[k]))
                        }
                    }
                tempVertices.push([tempArr[0], tempArr[1], tempArr[2]]) // > Push positions
                if(tempArr.length > 3){ // > Color case
                    colFlag = true ;
                    tempColors.push([tempArr[3], tempArr[4], tempArr[5]])
                } else{
                    tempColors.push([0.7, 0.7, 0.7]) // > Push gray
                }
                
                    
            }


            // > Vertex Textures Coords
            if(lItems[0] === "vt"){
                texFlag = true ; // > Set flags to return globally
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(Number(lItems[k]))
                        }
                    }
                    tempTextures.push([tempArr[0], tempArr[1]])
            }


            // > Vertex Normals
            if(lItems[0] === "vn"){
                normFlag  = true ; 
                let tempArr = []
                    for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(Number(lItems[k]))
                        }
                    }
                    tempNormals.push([tempArr[0], tempArr[1], tempArr[2]])
            }



            // > Faces
            if(lItems[0] === "f"){ //(always called after vertex information)
                // > Center and scale
                if(shiftAndCenter === false){
                    shiftAndCenter = true ;

                    // > shift object to center
                    let runningSum = [0,0,0] 
                    for(let i = 0 ; i < tempVertices.length ; i += 1 ){
                        runningSum = add(runningSum, tempVertices[i])
                    
                    }
                    let avg = div(runningSum, tempVertices.length)
                    
                    
                    for(let i = 0 ; i < tempVertices.length ; i += 1 ){
                        tempVertices[i] = sub(tempVertices[i], avg)
                    }

                    // > Scale object to fit
                    let maxDist = 0 ;
                    for(let i = 0 ; i < tempVertices.length ; i += 1 ){
                        for(let j = 0 ; j < tempVertices.length ; j += 1){
                            // console.log(obj.attributes[0][i], obj.attributes[0][j])
                            if(mag(sub(tempVertices[i], tempVertices[j])) > maxDist){
                                maxDist = mag(sub(tempVertices[i], tempVertices[j])) ; // > Largest distance
                            }
                        }
                    }
                    for(let i = 0 ; i < tempVertices.length ; i += 1){
                        tempVertices[i] = div(tempVertices[i], maxDist)
                       tempVertices[i] = mul(tempVertices[i], 2.5)
                    }
                }
                // > End shift and scale


                // > Note additional parsing to assemble triangles
                let tempArr = [] // > Push face data here
                for(let k = 1 ; k < lItems.length ; k += 1){ // > Get all data within tempArr
                        if(lItems[k] != ""){ // > Skip white space
                            tempArr.push(lItems[k]) // > Do not convert to number
                        }
                }
                // tempArr now holds our indices
                // Want to check if triangle or quad line
                


                for(let k = 0 ; k < tempArr.length ; k  += 1){
                    let curIdx = tempArr[k]
                    let idxData = tempArr[k].split("/")
                    // > Have we seen this index value?
                


                    if(seenVertex.has(curIdx)){ // > If we have already seen this index before
                        obj.triangles.push(seenVertex.get(curIdx)) ; // > Place new vertex into triangles

                    } else{ // > If we have no seen this index before
                        seenVertex.set(curIdx, seenVertex.size) // >  Mark that we have seen this
                        obj.triangles.push(seenVertex.get(curIdx))
                        // > Parse the rest of the information

                        // > Add vertices and colors (always)
                            let idx = Number(idxData[0]) - 1
                            
                            obj.attributes[0].push(tempVertices[idx])
                            obj.attributes[1].push(tempColors[idx])
                        // > Add textures
                            if(texFlag){
                                idx = Number(idxData[1]) - 1
                                obj.attributes[2].push(tempTextures[idx])
                            } else{
                                obj.attributes[2].push([0, 0])
                            }
                        // > Add normals
                            if(normFlag){
                                idx = Number(idxData[2]) - 1
                                obj.attributes[3].push(tempNormals[idx])
                            } else{
                                obj.attributes[3].push([0,0,0]) // > No normal data
                            }
                    }
                }
                
            }
        }




        // > Debugging
        // console.log(obj)
        // > End Debugging

        // > Set globalFlags
        globColorFlag = colFlag
        globTextureFlag = texFlag
        globNormalFlag = normFlag
        console.log(obj)
        return obj ;

}