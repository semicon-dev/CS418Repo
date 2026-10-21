
// import {setupGeometry} from './shaderCompile.js'



/** Draw one frame */
function draw(seconds) {
    gl.clearColor(...SpaceBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(sunGeom.vao)

    
    
    let v = m4view([15,5,3], [0,0,0], [0,1,0]) // some place to view it all from!
    //let v = m4view([3,10,3], [0,0,0], [0,1,0]) // some place to view it all from!
    
    gl.uniformMatrix4fv(program.uniforms.p, false, p)
    
    //  > Draw the elements!
    let sunRot = m4rotY(seconds * 3.14 ) ; // 2pi / 2 gives us 2 radians per second
    let sunTx = m4mul(v, sunRot) 
    //let sunTx = v

    // > Create the sun
    gl.uniformMatrix4fv(program.uniforms.mv, false, sunTx) // model BEFORE view
    gl.drawElements(sunGeom.mode, sunGeom.count, sunGeom.type, 0)

    // > Create the earth
    gl.bindVertexArray(earthGeom.vao)
    let earthScale = m4scale(0.5, 0.5, 0.5) ;
    let earthTrans = m4trans(6, 0, 0) ;
    let earthRotSun = m4rotY(seconds) ;
    let earthRot = m4rotY(seconds * 4)

    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v, earthRotSun, earthTrans, earthRot, earthScale)) // model BEFORE view
    gl.drawElements(earthGeom.mode, earthGeom.count, earthGeom.type, 0)


    // > Create Mars
    gl.bindVertexArray(marsGeom.vao)
    let marsScale = m4scale(0.5 * .8, 0.5 * .8, 0.5 * 0.8) ;
    let marsTrans = m4trans(6 * 1.6, 0, 0)
    let marsRot = m4rotY(seconds * 4 / 2.2) // should be div
    let marsRotSun = m4rotY(seconds / 1.9) // should be div
    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v, marsRotSun, marsTrans, marsRot, marsScale)) // model BEFORE view
    gl.drawElements(marsGeom.mode, marsGeom.count, marsGeom.type, 0)

    // Create moon
    gl.bindVertexArray(moonGeom.vao)
    let moonScale = m4scale(0.5 * 0.7, 0.7 * 0.5, 0.5 * 0.7)
    let moonTransEarth = m4trans(1.5, 0, 0) ;
    let moonRotEarth = m4rotY(seconds * 2) ;
    let moonTransSun = m4trans(6, 0, 0) ;
    let moonRotSun = m4rotY(seconds)


    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v, moonRotSun, moonTransSun, moonRotEarth, moonTransEarth, moonScale)) // model BEFORE view
    //gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v, moonRotEarth, moonTransEarth, moonScale)) // model BEFORE view
    gl.drawElements(moonGeom.mode, moonGeom.count, moonGeom.type, 0) ;


    // Create Phobos
    gl.bindVertexArray(phobosGeom.vao)

    let phobosScale = m4scale(0.5 * 0.7, 0.7 * 0.5, 0.5 * 0.7)
    let phobosTransMars = m4trans(.75, 0, 0) ;
    let phobosRotMars = m4rotY(seconds * 5) 
    let phobosTransSun = m4trans(6 * 1.6, 0, 0) ;
    let phobosRotSun = m4rotY(seconds / 1.9)

    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v, phobosRotSun, phobosTransSun, phobosRotMars, phobosTransMars, phobosScale)) // model BEFORE view
    gl.drawElements(phobosGeom.mode, phobosGeom.count, phobosGeom.type, 0)

    // Create Deimos

    gl.bindVertexArray(deimosGeom.vao)

    let dScale = m4scale(0.5 * 0.4, 0.4 * 0.5, 0.5 * 0.4)
    let dTransMars = m4trans(1.5, 0, 0) ;
    let dRotMars = m4rotY(seconds * 4 / 2.2 * 1.4 )
    let dTransSun = m4trans(6 * 1.6, 0, 0)
    let dRotSun = m4rotY(seconds / 1.9)

    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v, dRotSun, dTransSun, dRotMars, dTransMars, dScale)) // model BEFORE view
    gl.drawElements(deimosGeom.mode, deimosGeom.count, deimosGeom.type, 0)


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
        window.p = m4perspNegZ(0.1, 30, 1.2, canvas.width, canvas.height) // window - - projection always assumes present at origin
    }
}

/** Compile, link, set up geometry */
window.addEventListener('load', async (event) => {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch('vx.glsl').then(r => r.text())
    let fs = await fetch('fr.glsl').then(r => r.text())
    window.program = compileShader(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    
    window.sunGeom = setupGeometry(sunOct) ; // > Ok so we call the setups first and THEN we call the 
    window.earthGeom = setupGeometry(earthOct)
    window.marsGeom = setupGeometry(marsOct)
    window.moonGeom = setupGeometry(moonTet) // test with octohedrons to check face directions
    window.phobosGeom = setupGeometry(tetrahedron)
    window.deimosGeom = setupGeometry(tetrahedron)
    // let data = await fetch('geom.json').then(r=>r.json())
    // window.geom = setupGeometry(data) ;

    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
})