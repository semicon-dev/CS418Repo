window.globColorFlag = false ; 
window.globTextureFlag = false ;
window.globNormalFlag = false ; 
window.texShaderOn = false ; 
window.img = new Image() ; // > Declare that this thing exists

function draw(seconds) {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)
    gl.bindVertexArray


    // > Do texture stuff here? !!
    if(texShaderOn == true){
        let slot = 0 ; 
        gl.uniform1i(program.uniforms.currentTexture, slot)
    }




    // let eye_position = [3 * Math.cos(seconds * .4), 1.25, 3 * Math.sin(seconds * .4)] // > Eye position in world coords
    let eye_position = [3, 1.25, 3] // > Eye position in world coords
    gl.uniform3fv(program.uniforms.eye_position, eye_position)
    // > NOTE!! We will need to rotate this eye position vector ( DONE!)

    // Create model matrix and position or model correctly within space
    let MM = m4rotX(-Math.PI/2) ; // Model matrix to rotate our terrain slightly
    MM = m4mul(m4rotY((seconds * 0.7)), MM) ;
    gl.uniformMatrix4fv(program.uniforms.MM, false, MM)

    // > Create view matrix 
    let VM = m4view(eye_position, [0,0,0], [0,1,0])
    gl.uniformMatrix4fv(program.uniforms.VM, false, VM)
    gl.uniformMatrix4fv(program.uniforms.p, false, p)

    // > Create LIGHT SOURCE!!
    let light_direction = normalize([1, 1.25, 1]) // > Again, this should stay constant in world coordinates
     // > Should we just calculate the halfway vector within the shader????
    let halfway_vec = normalize(add(light_direction, [0,0,1])) 
    gl.uniform3fv(program.uniforms.lightdir, light_direction)
    gl.uniform3fv(program.uniforms.lightcolor, ([1,1,1]))
    gl.uniform3fv(program.uniforms.halfway, halfway_vec) // > Again, not sure if we directly need this if clculating
    // via the Phong approximation, (interpolated world space position of vertices - eye location)
    // > Handle within the fragment shader?
    
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}




/** Compute any time-varying or animated aspects of the scene */
function tick(milliseconds) {
    let seconds = milliseconds / 1000;
    window.globSeconds = seconds ;
    draw(seconds)
    requestAnimationFrame(tick)
}

/** Resizes the canvas to completely fill the screen */
function fillScreen() {
    let canvas = document.querySelector('canvas')
    document.body.style.margin = '0'
    canvas.style.width = '100vw'
    canvas.style.height = '100vh'
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight
    canvas.style.width = ''
    canvas.style.height = ''
    if (window.gl) {
        gl.viewport(0,0, canvas.width, canvas.height)
        window.p = m4perspNegZ(0.1, 10, 1, canvas.width, canvas.height) // I think this is already done
    }
}

function addNormals(geom) {
    let ni = 3
   
    for(let i = 0; i < geom.triangles.length; i+=1) {
        let p0 = geom.attributes[0][geom.triangles[i][0]]
        let p1 = geom.attributes[0][geom.triangles[i][1]]
        let p2 = geom.attributes[0][geom.triangles[i][2]]
        let e1 = sub(p1,p0)
        let e2 = sub(p2,p0)
        let n = cross(e1,e2)
        geom.attributes[ni][geom.triangles[i][0]] = add(geom.attributes[ni][geom.triangles[i][0]], n)
        geom.attributes[ni][geom.triangles[i][1]] = add(geom.attributes[ni][geom.triangles[i][1]], n)
        geom.attributes[ni][geom.triangles[i][2]] = add(geom.attributes[ni][geom.triangles[i][2]], n)
    }
    for(let i = 0; i < geom.attributes[0].length; i+=1) {
        geom.attributes[ni][i] = normalize(geom.attributes[ni][i])
    }
}



/** Compile, link, set up geometry */
window.addEventListener('load', async (event) => {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )

    // > Test adding in query selector here - - -
    document.querySelector('#submit').addEventListener('click', event => {
    const objPath = String(document.querySelector('#filePathIn').value) || "" 
    const imgPath = String(document.querySelector('#imagePathIn').value) || ""


       // > Note : here is probably the place to update the actual geometry
    console.log("Calling parseObject")
    
    // let geometry = parseObject(objPath) // THIS DOES NOT WORK! Must keep async stuff in check
    parseObject2(objPath).then(geometry => {
      if(!globNormalFlag){ addNormals(geometry)}
        window.geom = setupGeometry(geometry)
    })
    // > Now handle texture stuff - - - also on submit, no "change" thing like in the textures mp
    let strLen = imgPath.length ;

    // > Check if png or jpeg
        if(((imgPath.substring(strLen - 4, strLen) == ".png") 
            || (imgPath.substring(strLen - 5, strLen) == ".jpeg"))){ // && (globTextureFlag === true ? - nope, against assignment specifications
        console.log("That is a png or jpeg") // debugging
        img.crossOrigin = 'anonymous' // > Whatever that even means
        img.src = imgPath ; // >take local file as the image URL
        img.addEventListener('error', (event) =>{ // > Error if the png isnt correct
            // > !! ADD CHANGE HERE TO "HOT SWAP" TO NON TEXTURE SHADER PROGRAM
            window.program = compileShader(vs,fs) // swap shader for notex
            texShaderOn = false ; 
        })
        img.addEventListener('load', (event) =>{ // > Success of loader
            //swap shader to texture shader
            window.program = compileShader(vs,fs_tex)
            texShaderOn = true ;
            // > Now we just need to write the shader and send this puppy to the GPU
            let slot = 0 ;
            let texture = gl.createTexture()
            gl.activeTexture(gl.TEXTURE0 + slot) ;
            gl.bindTexture(gl.TEXTURE_2D, texture) ;

            // CLAMPING
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // Zooming in and Zooming out
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            // Send pixel data to gpu
            gl.texImage2D(
                gl.TEXTURE_2D, //dest slot
                0, // mipmap level,
                gl.RGBA, 
                gl.RGBA, 
                gl.UNSIGNED_BYTE, 
                img, // SOURCE DATA< PROVIDED AS A WINDOW
            ) ;
            gl.generateMipmap(gl.TEXTURE_2D)


        })


       } else {
        window.program = compileShader(vs,fs) // swap shader here??!!
        texShaderOn = false ;
       }


    })
    





    // > End test query selector add

    let vs = await fetch('vx.glsl').then(r => r.text())
    let fs = await fetch('fr.glsl').then(r => r.text())
    let fs_tex = await fetch('fr_tex.glsl').then(r => r.text())
    window.program = compileShader(vs,fs)
    texShaderOn = false
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    // let monkey = await fetch('monkey.json').then(res => res.json())
   //// > We need to figure out how to load a normal object in js, not just monkey
    let monkey = octCol // > Ok so, the issue looks to be with how the tetrahedron is defined
    // loading it in is fine, but the nromals don't quire work
    addNormals(monkey) // test
    window.geom = setupGeometry(monkey);  
 
    
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
})

