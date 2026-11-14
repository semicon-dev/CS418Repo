/** Draw one frame */
// TESTING



// TESTING END


function draw(seconds) {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    gl.uniform4fv(program.uniforms.color, IlliniOrange)




    let eye_position = [3 * Math.cos(seconds * .4), 1.25, 3 * Math.sin(seconds * .4)] // > Eye position in world coords
    gl.uniform3fv(program.uniforms.eye_position, eye_position)
    // > NOTE!! We will need to rotate this eye position vector ( DONE!)

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

// old view coord stuff - - -
//   //let m = m4mul(m4rotY(seconds * (1/5)), m4rotX(-Math.PI/2))
//     let m = m4rotX(-Math.PI/2) ;
//     let v = m4view([1,1.5 ,3], [0,0,0], [0,1,0])
//     gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v,m))
//     gl.uniformMatrix4fv(program.uniforms.p, false, p)

//     // > Source 1
//     let ld = normalize([1,3,1]) ;
//     let h = normalize(add(ld, [0,0,1])) // We are always looking down the z axis
//     gl.uniform3fv(program.uniforms.lightdir, ld)
//     gl.uniform3fv(program.uniforms.lightcolor, ([1,1,1]))
//     gl.uniform3fv(program.uniforms.halfway, h)
    
//     gl.drawElements(geom.mode, geom.count, geom.type, 0)


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



//   for(let i = 0; i < geom.attributes[0]; i+=1) { // > add normal for every vertex
//         let p_v = geom.attributes[0][i]
//         let p_n = 
//         let p_s = 
//         let p_e = 
//         let p_w = 



//         geom.attributes[ni][geom.triangles[i][0]] = add(geom.attributes[ni][geom.triangles[i][0]], n)
//         geom.attributes[ni][geom.triangles[i][1]] = add(geom.attributes[ni][geom.triangles[i][1]], n)
//         geom.attributes[ni][geom.triangles[i][2]] = add(geom.attributes[ni][geom.triangles[i][2]], n)
//     }
//     for(let i = 0; i < geom.attributes[0].length; i+=1) {
//         geom.attributes[ni][i] = normalize(geom.attributes[ni][i])
//     }

/** Compile, link, set up geometry */
window.addEventListener('load', async (event) => {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )

    window.gridObj = makeGrid(2) ; // > Make base grid - - -
    window.terrainObj = makeTerrain(0)
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
       addNormals(terrainObj) // test
       window.geom = setupGeometry(terrainObj);   // debugging!!
       
    })

    // > End test query selector add

    let vs = await fetch('vx.glsl').then(r => r.text())
    let fs = await fetch('fr.glsl').then(r => r.text())
    window.program = compileShader(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    //window.geom = setupGeometry(unitGridTest2)  ; // Testing

    window.geom = setupGeometry(terrainObj)  ;
   
    
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
})

