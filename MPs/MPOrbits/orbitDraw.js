
// import {setupGeometry} from './shaderCompile.js'

var tetrahedron =
    {"triangles":
        [0,1,2
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
            // copeis
            ]
           , // color data!
            [[0.9,0.5,0.0]
            ,[ 1.0, 0.9,0.0]
            ,[0.8, 0.4, 0.0]
            ,[ 0.5,0.3, 0.1]
            ]
        ]
    }

    var octahedron = {"triangles":
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
           , // color data!
            [[1,0.5,0.5]
            ,[0.5,1,0.5]
            ,[0.5,0.5,1]
            ,[0.5,0,0.5]
            ,[0.5,0.5,0]
            ,[0,0.5,0.5]
            ]
        ]
    }



/** Draw one frame */
function draw(seconds) {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    gl.uniform4fv(program.uniforms.color, IlliniOrange)
    let m = m4rotY(seconds)
    let v = m4view([1,2,4], [0,0,0], [0,1,0]) // some place to view it all from!
    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v,m)) // model BEFORE view
    gl.uniformMatrix4fv(program.uniforms.p, false, p)
    
    //  > Draw the elements!
    
    // > Element 1 
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

    // > Element 2
    let m2trans = m4trans(2, 0, 0)
    let m2rot = m4rotX(seconds)
    m2 = m4mul(m2rot, m2trans)
    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v,m2)) // model BEFORE view
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

    // > Element 3
    let m3trans = m4trans(2, 3, 0)
    let m3rot = m4rotX(seconds * 2)
    m3 = m4mul(m3rot, m3trans)
    gl.uniformMatrix4fv(program.uniforms.mv, false, m4mul(v,m3)) // model BEFORE view
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
        window.p = m4perspNegZ(0.1, 10, 1.5, canvas.width, canvas.height) // window - - projection always assumes present at origin
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
    
    window.geom = setupGeometry(octahedron) ; // > Ok so we call the setups first and THEN we call the 
    // let data = await fetch('geom.json').then(r=>r.json())
    // window.geom = setupGeometry(data) ;

    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(tick)
})