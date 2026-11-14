// > Initialize eye position values and forward vector
window.eye_position = [2.5, 3, 2.5] // > Eye position in world coords
// > eye forward dir
window.eye_f = normalize(mul(eye_position, -1)) // > Normalized starting forward position!
// window.eye_f = [1,1,1]
// > Note that global up in y hat



function draw(seconds) {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    gl.uniform4fv(program.uniforms.color, IlliniOrange)

   // > Handle matrix creation

   

  
    // > Attempt to construct view Matrix
    let T = [1, 0, 0, 0,
            0, 1, 0, 0, 
            0, 0, 1, 0, 
            -eye_position[0], -eye_position[1], -eye_position[2], 1
            ]
    
    // > right direction
    let r_dir = normalize(cross(eye_f, [0,1,0])) // > Cross products only defined in R3 
    // > Camera up direction
    let u_dir = normalize(cross(r_dir, eye_f))
    let R = [ r_dir[0], u_dir[0], -eye_f[0], 0 ,
            r_dir[1], u_dir[1], -eye_f[1], 0 ,
            r_dir[2], u_dir[2], -eye_f[2], 0,
            0, 0, 0, 1
            ]
    
    // > Create view matrix

    // > Respond to user input (only takes effect on future cycles!)




    // > End respond to user input
    let VM = m4mul(R, T) ;
    // > End handle eye repositioning and such
    gl.uniform3fv(program.uniforms.eye_position, eye_position)
    

    // Create model matrix and position or model correctly within space
    let MM = m4rotX(-Math.PI/2) ; // Model matrix to rotate our terrain slightly
    gl.uniformMatrix4fv(program.uniforms.MM, false, MM)

    // > Create view matrix 
    //let VM = m4view(eye_position, [0,0,0], [0,1,0])
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
    if(keysBeingPressed['ArrowUp']){
    console.log("You are pressing ArrowUp!") ;
    }

    // > Reposition eye based on user input
    // Note that this only takes effect on "future ticks/cycles"
    if(keysBeingPressed['w']){
        eye_position = add(eye_position, mul(eye_f, 0.05))
    }
    if(keysBeingPressed['s']){
        eye_position = add(eye_position, mul(eye_f, -0.05))
    }
    if(keysBeingPressed['d']){
        eye_position = add(eye_position, mul(r_dir, 0.05))
    }
    if(keysBeingPressed['a']){
        eye_position = add(eye_position, mul(r_dir, -0.05))
    }

    // > Change direction based on user input
    let c = Math.cos(0.03)
    let s = Math.sin(0.03)
    let c_1 = 1 - c
    
    if(keysBeingPressed['ArrowUp']){
        // > Rotate forward vector around right vector
        let curR = [
    r_dir[0]*r_dir[0]*c_1 + c,
    r_dir[0]*r_dir[1]*c_1 + r_dir[2]*s,
    r_dir[0]*r_dir[2]*c_1 - r_dir[1]*s,

    r_dir[0]*r_dir[1]*c_1 - r_dir[2]*s,
    r_dir[1]*r_dir[1]*c_1 + c,
    r_dir[1]*r_dir[2]*c_1 + r_dir[0]*s,

    r_dir[0]*r_dir[2]*c_1 + r_dir[1]*s,
    r_dir[1]*r_dir[2]*c_1 - r_dir[0]*s,
    r_dir[2]*r_dir[2]*c_1 + c
    ]
        eye_f = m3mul(curR, eye_f)
    }

    if(keysBeingPressed['ArrowDown']){
        // > Rotate forward vector around right vector
        s = -s ; // > for opposite direction roation note sine is even, cos in odd
    let curR = [
    r_dir[0]*r_dir[0]*c_1 + c,
    r_dir[0]*r_dir[1]*c_1 + r_dir[2]*s,
    r_dir[0]*r_dir[2]*c_1 - r_dir[1]*s,

    r_dir[0]*r_dir[1]*c_1 - r_dir[2]*s,
    r_dir[1]*r_dir[1]*c_1 + c,
    r_dir[1]*r_dir[2]*c_1 + r_dir[0]*s,

    r_dir[0]*r_dir[2]*c_1 + r_dir[1]*s,
    r_dir[1]*r_dir[2]*c_1 - r_dir[0]*s,
    r_dir[2]*r_dir[2]*c_1 + c
    ]
        eye_f = m3mul(curR, eye_f)
    }

    if(keysBeingPressed['ArrowRight']){
        // > Rotate forward vector around right vector
        let globUp = [0, 1, 0]
        s = -s
    let curR = [
    globUp[0]*globUp[0]*c_1 + c,
    globUp[0]*globUp[1]*c_1 + globUp[2]*s,
    globUp[0]*globUp[2]*c_1 - globUp[1]*s,

    globUp[0]*globUp[1]*c_1 - globUp[2]*s,
    globUp[1]*globUp[1]*c_1 + c,
    globUp[1]*globUp[2]*c_1 + globUp[0]*s,

    globUp[0]*globUp[2]*c_1 + globUp[1]*s,
    globUp[1]*globUp[2]*c_1 - globUp[0]*s,
    globUp[2]*globUp[2]*c_1 + c
    ]
        eye_f = m3mul(curR, eye_f)
    }
       if(keysBeingPressed['ArrowLeft']){
        // > Rotate forward vector around right vector
        let globUp = [0, 1, 0]
        
    let curR = [
    globUp[0]*globUp[0]*c_1 + c,
    globUp[0]*globUp[1]*c_1 + globUp[2]*s,
    globUp[0]*globUp[2]*c_1 - globUp[1]*s,

    globUp[0]*globUp[1]*c_1 - globUp[2]*s,
    globUp[1]*globUp[1]*c_1 + c,
    globUp[1]*globUp[2]*c_1 + globUp[0]*s,

    globUp[0]*globUp[2]*c_1 + globUp[1]*s,
    globUp[1]*globUp[2]*c_1 - globUp[0]*s,
    globUp[2]*globUp[2]*c_1 + c
    ]
        eye_f = m3mul(curR, eye_f)
    }


   // > End reposition eye based on user input
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

// > Test add key event listener
// - - - - - - - - - - - - - - -
window.keysBeingPressed = {}
window.addEventListener('keydown', event => keysBeingPressed[event.key] = true)
window.addEventListener('keyup', event => keysBeingPressed[event.key] = false)

/*
The way that I am interpretting this - 
add an event listener, which listens for a "keydown event" if yes, index into keybeingpressed list we created
when indexxing into this, we can set that key value pair, looked up via the specific key to be true or false

*/
// > End test add key event listener
// - - - - - - - - - - - - - - - - -



/** Compile, link, set up geometry */
window.addEventListener('load', async (event) => {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )

    // > Create terrain
    window.gridObj = makeGrid(50) ; // > Make base grid - - -
    window.terrainObj = makeTerrain(50)
    addNormals(terrainObj) // test
    window.geom = setupGeometry(terrainObj);   // debugging!!
    // > End create terrain

    

    let vs = await fetch('vx.glsl').then(r => r.text())
    let fs = await fetch('fr.glsl').then(r => r.text())
    window.program = compileShader(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    //window.geom = setupGeometry(unitGridTest2)  ; // Testing

    window.geom = setupGeometry(terrainObj)  ;
   
   // console.log("testout")


    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
    
})

