function compileShader(vs_source, fs_source){
    // > Create shader objects from passed in sources
    const vs = gl.createShader(gl.VERTEX_SHADER) // Create vertex shader
    gl.shaderSource(vs, vs_source) ; // Id imagine im basically linking this vs object with a file / path?
    gl.compileShader(vs) ;

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) { // > Straight copied, just and error thrower
        console.error(gl.getShaderInfoLog(vs))
        throw Error("Vertex shader compilation failed")
    }

    // > Do the same thing for the fragment shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, fs_source)
    gl.compileShader(fs)

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fs))
        throw Error("Fragment shader compilation failed")
    }

    const program = gl.createProgram() // I think we're just calling the webgl api here to make a approacra
    gl.attachShader(program, vs) ; // > Link nweb gl programs to shaders.
    gl.attachShader(program, fs) ;

    gl.linkProgram(program) ; // I think this just like,,,,, uhhhh makes it 
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { // > Copy paste error messzage
        console.error(gl.getProgramInfoLog(program))
        throw Error("Linking failed")
    }

    // > Loop through uniforms in shader course (glsl files)
    // store in glsl program object
    const uniforms = {}
    for(let i = 0 ; i < gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) ; i += 1){
        let info = gl.getActiveUniform(program, i) ; // check program at indices for active uniforms
        uniforms[info.name] = gl.getUniformLocation(program, info.name) ; // I think this adds things to our uniforms
        // LUT / array / dictionary / whatever object this is, and adds the location to the array
        // Not actually totally sure what this does
    }
    program.uniforms = uniforms

    return program ; // Pretty darn self explanatory

}

// The big geometry function - - - 
function setupGeometry(geom){ // > Typo in original ?
    var triangleArray = gl.createVertexArray() ;
    gl.bindVertexArray(triangleArray) ; // > Id imagine that this means we can access now from gl apis ?

    for(let i = 0 ; i < geom.attributes.length ; i+= 1){ // > Loop through al atributes
        let buf  = gl.createBuffer() ;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf) ;
        let f32 = new Float32Array(geom.attributes[i].flat()) // > Flatten array for eaier processing
        gl.bufferData(gl.ARRAY_BUFFER, f32, gl.STATIC_DRAW) ; // > Some how tie in local object to webGL object

        gl.vertexAttribPointer(i, geom.attributes[i][0].length, gl.FLOAT, false, 0 ,0) ;
        gl.enableVertexAttribArray(i) ;

    }

    var indices = new Uint16Array(geom.triangles.flat())
    var indexBuffer = gl.createBuffer() ;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    return {
        mode : gl.TRIANGLES,
        count : indices.length,
        type : gl.UNSIGNED_SHORT,
        vao: triangleArray // > Current populated with . . . ? knwon gl triangles
        // > I am really struggling to trace the exact data path through these seemingly opaque funciton calls
    }
}

    function draw(milliseconds){
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.useProgram(program)

        // values that dont vary, uniforms

        // gl.uniform1f(program.uniforms.seconds, milliseconds/1000) ;
        

         translateMatrix = m4trans(0.5*Math.sin(milliseconds / 1000 * .1), 0.5*Math.cos(milliseconds / 1000) , 0 ) ;
         rotateMatrix = m4rotZ(milliseconds / 1000 * 0.65) ;
      
        // transformMatrix = m4mul(rotateMatrix, translateMatrix) ;
         transformMatrix = m4mul(translateMatrix, rotateMatrix) ;
        // transformMatrix = rotateMatrix ;
        //transformMatrix = translateMatrix ;

       // transformMatrix = m4scale(1.0, 1.0, 1.0) ; // > Test with a scale of identity
        // > Take transpose possibly? 
        
        // > Place as uniform object
        gl.uniformMatrix4fv(program.uniforms.transform, true,  transformMatrix) ;
        // > Does this have to do with transposes? Idk, but if I set it to "false"
        // > I then get different beahvior
        

        window.countNum += 1 ;
        // console.log(window.countNum)
        if((window.countNum % 100) == 0 ){
        console.log("TEST OUTPUT") ; 
        }
        // console.log(txMat) ;



        // > End creation of matrix object
        gl.bindVertexArray(geom.vao) ;
        gl.drawElements(geom.mode, geom.count, geom.type, 0) ;

    }

    function tick(milliseconds){
        draw(milliseconds) // > Calls draw with curr number of ms
        requestAnimationFrame(tick) ; // > Calls a draw request, with current tick / wait function
        // > Asks browser to call tick before bnext frame

    }

    window.addEventListener('load', async (event) =>{
        window.gl = document.querySelector('canvas').getContext('webgl2') // > 
        // > OK HUGE, this is us setting the global (window) object gl, which is how we can actually call gl APIs
        window.countNum = 0 ;
        // > This answers a huge quesiton, i should have started reading the code here
        let vs = await fetch('mp4-vx.glsl').then(r => r.text())
        let fs = await fetch('mp4-fr.glsl').then(r => r.text())

        window.program = compileShader(vs, fs) 
        let data = await fetch('geom.json').then(r=>r.json())
        window.geom = setupGeometry(data) ; // > Ok so we call the setups first and THEN we call the 
        // > request animation frame that actually DOES the drawing now that all our information is parsed
        // and pretty
        requestAnimationFrame(tick) // > Ask brower to call tick before first frame
    })