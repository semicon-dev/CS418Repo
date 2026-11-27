/** Draw one frame */
// GLOBALS
// > Again, note, not sure why setting these as global consts doesn't work, unless they get overriden?
// Yes, that appears to be the issue, I am effectively using pointers are overwriting these things
// Yes, I was basically overwriting the consants because I made the name constant and not the actual data inside of the array
const baseColor = new Float32Array([1, 1, 1, 0.3])
const errorColor = new Float32Array([1, 0, 1, 0])
window.curColor = baseColor.slice()
window.img = new Image() ; // > Declare that this thing exists
window.texShaderOn = 0 ; // I am using a flag here because I barely understand this code
// END GLOBALS


function draw(seconds) {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program) // > !! I think I definitely need this in here to swap between programs being used
    gl.bindVertexArray(geom.vao)

    if(texShaderOn == 0){ // I think we only need this color stuff when using shader 1
    gl.uniform4fv(program.uniforms.color, curColor)
    }

    // > Do texture stuff here? !!
    if(texShaderOn == 1){
        let slot = 0 ; 
        gl.uniform1i(program.uniforms.currentTexture, slot)
    }
    // > End possible texture stuff


    let eye_position = [3 * Math.cos(seconds * .4), 1.25, 3 * Math.sin(seconds * .4)] // > Eye position in world coords
    gl.uniform3fv(program.uniforms.eye_position, eye_position)

    // Create model matrix and position or model correctly within space
    let MM = m4rotX(-Math.PI/2) ; // Model matrix to rotate our terrain slightly
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
    let ni = geom.attributes.length
    geom.attributes.push([]) // > Push a new attribute (the normals) (at next available attributes spot)
    for(let i = 0; i < geom.attributes[0].length; i+=1) {
        geom.attributes[ni].push([0,0,0])
    }

    let g_len = Math.sqrt(geom.attributes[0].length) // grid length

    for(let row = 0; row < g_len; row+=1) { // > add normal for every vertex
        for(let col = 0 ; col < g_len ; col += 1){
            // > Create p_n
            if(row != 0){
                p_n =  geom.attributes[0][(row - 1) * g_len + col]
            } else { p_n = geom.attributes[0][(row) * g_len + col]}
            // > Create p_s
            if(row < (g_len - 1)){
                p_s =  geom.attributes[0][(row + 1) * g_len + col]
            } else { p_s = geom.attributes[0][(row) * g_len + col]}
            // > Create p_e
            if(col < (g_len - 1)){
                p_e =  geom.attributes[0][(row) * g_len + col + 1]
            } else { p_e = geom.attributes[0][(row) * g_len + col]}

            // > Create p_s
            if(col != 0){
                p_w =  geom.attributes[0][(row) * g_len + col - 1]
            } else { p_w = geom.attributes[0][(row) * g_len + col]}
            v_ns = sub(p_n, p_s)
            v_ew = sub(p_w, p_e)
            v_norm = cross(v_ns, v_ew)

            geom.attributes[ni][g_len * row + col] = add(geom.attributes[ni][g_len * row + col], v_norm)
        } 
    }


    for(let i = 0; i < geom.attributes[0].length; i+=1) {
        geom.attributes[ni][i] = normalize(geom.attributes[ni][i])
    }
}

// > Add texture coord to geometry
function addTexcoord(geom){
    let ni = geom.attributes.length
    geom.attributes.push([]) // > Push a new attribute (the texcoord) (at next available attributes spot)
    for(let i = 0; i < geom.attributes[0].length; i+=1) {
        geom.attributes[ni].push([0,0])
    }
    // > Need to add a texcoord \forall vertices? 
    let g_len = Math.sqrt(geom.attributes[0].length) ; // Get grid length
    let offset = 1 / g_len

    for(let row = 0 ; row < g_len ; row += 1){
            for(let col = 0 ; col < g_len ; col += 1){
                geom.attributes[ni][g_len * row + col] = ([row * offset, col * offset])
            }
        }
}

// > For textures MP : I believe that this is the setup are and we need to
//create a second shader program
// > I think that we should be able to do this simply by clicking "enter"
// > Although we shouldnt need to do this by clicking the "regen terrain" button

window.addEventListener('load', async (event) => {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )

    window.gridObj = makeGrid(50) ; // > Make base grid - - -
    window.terrainObj = makeTerrain(50)
    addNormals(terrainObj) // test
    addTexcoord(terrainObj)
    // window.program = compileShader(vs,fs_notex) // > will need to swap compiled shaders upon text input
    
    // > Test adding in query selector here - - -
    document.querySelector('#submit').addEventListener('click', event => {
    const gridsize = Number(document.querySelector('#gridsize').value) || 2
    const faults = Number(document.querySelector('#faults').value) || 0
    // TO DO: generate a new gridsize-by-gridsize grid here, then apply faults to it
       // console.log(gridsize) ; // > !!DEBUG!!
       gridObj = makeGrid(gridsize) ; 
       // console.log(gridObj["attributes"][0]) // debugging!!
       console.log(gridObj["triangles"].length) // debugging!!

       // > Now begin taking in number of faults
       terrainObj = makeTerrain(faults) ;
       addNormals(terrainObj) 
       addTexcoord(terrainObj)
       window.geom = setupGeometry(terrainObj);   // debugging!!
       
    })

    document.querySelector('#material').addEventListener('change', event =>{ // This works, but if I press enter,
        // Parse the input to see if anything changes
        // > Get the data in the textbox
        let inputString = String(document.querySelector('#material').value)
        let strLen = inputString.length ; 
       // console.log(inputString) // > Debug

       // > Check if the string ends with .png or .jpeg
       if((inputString.substring(strLen - 4, strLen) == ".png") || (inputString.substring(strLen - 5, strLen) == ".jpeg")){
        console.log("That is a png or jpeg") // debugging
        img.crossOrigin = 'anonymous' // > Whatever that even means
        img.src = inputString ; // >take local file as the image URL
        img.addEventListener('error', (event) =>{ // > Error if the png isnt correct
            // > !! ADD CHANGE HERE TO "HOT SWAP" TO NON TEXTURE SHADER PROGRAM
            window.program = compileShader(vs,fs_notex) // swap shader for notex
            texShaderOn = 0 ; 
            curColor = errorColor.slice() // > Should be a callback event and not run any code after this line
        })
        img.addEventListener('load', (event) =>{ // > Success of loader
            //swap shader to texture shader
            window.program = compileShader(vs,fs_tex)
            texShaderOn = 1 ;
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


       } 


       // RECOLOR HANDLING HERE - - - -
       // - - - - - - - - - - - - - - -
       // - - - - - - - - - - - - - - - 
       else if(inputString.substring(0, 1) == "#"){
        window.program = compileShader(vs,fs_notex) // swap shader here??!!
        texShaderOn = 0 ; 
        // NOTE : may need to explicitly relink shader thing here
        // console.log("Looks like you're trying to recolor! We can do that for you!") //debug
        if(strLen != 9){ // > Incorrect string length for recolor
            // Default to base color
            console.log("wrong string legnth")
            //curColor = new Float32Array([1, 1, 1, 0.3])
            curColor = baseColor.slice() // Should take care of object overwriting
        } else{
        // > Add colors and perform error checking
        curColor[0] = Number('0x' + inputString.substring(1,3)) / (15*16 + 15)
        curColor[1] = Number('0x' + inputString.substring(3,5)) / (15*16 + 15)
        curColor[2] = Number('0x' + inputString.substring(5,7)) / (15*16 + 15)
        curColor[3] = Number('0x' + inputString.substring(7,9)) / (15*16 + 15)
        }
        
       } else{
        window.program = compileShader(vs,fs_notex) // !!SWAP SHADER FOR NOTEX
        texShaderOn = 0  ;
        // NOTE : may need to explicitly relink different fragment shader here
        console.log("In final else")
        //curColor = new Float32Array([1, 1, 1, 0.3]) // Note : not sure why this works and using consts doesnt
        curColor = baseColor.slice() // Yes, using the slice technique works, as I was
        // overwriting essentially a pointer. wow. I wish this just made pointers not opaque

       }

    })


    // > End test query selector add

    let vs = await fetch('vx.glsl').then(r => r.text())
    let fs_notex = await fetch('fr_notex.glsl').then(r => r.text())
    let fs_tex = await fetch('fr_tex.glsl').then(r => r.text()) // > Texture shader to switch to!!!!

    window.program = compileShader(vs,fs_notex) // > will need to swap compiled shaders upon text input!!
    texShaderOn = 0 ; 
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    //window.geom = setupGeometry(unitGridTest2)  ; // Testing

    window.geom = setupGeometry(terrainObj)  ;
   
    
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
})

