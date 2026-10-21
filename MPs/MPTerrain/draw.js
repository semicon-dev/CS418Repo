/** Draw one frame */
// TESTING



// TESTING END


function draw(seconds) {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    gl.uniform4fv(program.uniforms.color, IlliniOrange)

    // > Source 1
    let ld = normalize([1,1,1]) ;
    let h = normalize(add(ld, [0,0,1])) // We are always looking down the z axis
    gl.uniform3fv(program.uniforms.lightdir, ld)
    gl.uniform3fv(program.uniforms.lightcolor, ([1,1,1]))
    gl.uniform3fv(program.uniforms.halfway, h)

    // > Source 2
    let ld2 = normalize([0,-1,1]) ;
    let h2 = normalize(add(ld2, [0,0,1])) // We are always looking down the z axis
    gl.uniform3fv(program.uniforms.lightdir2, ld2)
    gl.uniform3fv(program.uniforms.lightcolor2, ([0, 0.5,0.2]))
    gl.uniform3fv(program.uniforms.halfway2, h2)



    let m = m4mul(m4rotY(seconds * (1/5)), m4rotX(-Math.PI/2))
    //let m = m4rotX(-Math.PI/2) ;
    let v = m4view([1,1,3], [0,0,0], [0,1,0])
    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v,m))
    gl.uniformMatrix4fv(program.uniforms.p, false, p)
    
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}

/** Compute any time-varying or animated aspects of the scene */
function tick(milliseconds) {
    let seconds = milliseconds / 1000;

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
    geom.attributes.push([])
    for(let i = 0; i < geom.attributes[0].length; i+=1) {
        geom.attributes[ni].push([0,0,0])
    }
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

    window.gridObj = makeGrid(2) ; //!!TEST
    // > Test adding in query selector here - - -
    document.querySelector('#submit').addEventListener('click', event => {
    const gridsize = Number(document.querySelector('#gridsize').value) || 2
    const faults = Number(document.querySelector('#faults').value) || 0
    // TO DO: generate a new gridsize-by-gridsize grid here, then apply faults to it
        console.log(gridsize) ; // > FOR DEBUGGING THIS LOOKS PREEEEEETTTTTTTY GOODERINO!
       gridObj = makeGrid(gridsize) ; 
    })

    // > End test query selector add

    let vs = await fetch('vx.glsl').then(r => r.text())
    let fs = await fetch('fr.glsl').then(r => r.text())
    window.program = compileShader(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    //window.geom = setupGeometry(unitGridTest2)  ; // Testing

    window.geom = setupGeometry(gridObj)  ;
   
    
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
})

