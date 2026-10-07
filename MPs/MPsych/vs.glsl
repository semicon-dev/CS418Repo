#version 300 es
precision highp float;

out vec4 vPos ; 
void main() {
    // > Use ternary operations such that we dont break thread warp
    gl_Position = (gl_VertexID == 0 ? vec4(-1.0, -1.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0)) 
            + (gl_VertexID == 1 ? vec4(1.0, -1.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0))
            + (gl_VertexID == 2 ? vec4(1.0, 1.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0))
            + (gl_VertexID == 3 ? vec4(1.0, 1.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0))
            + (gl_VertexID == 4 ? vec4(-1.0, 1.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0))
            + (gl_VertexID == 5 ? vec4(-1.0, -1.0, 0.0, 1.0) : vec4(0.0, 0.0, 0.0, 0.0))
            ;

            vPos = gl_Position ; // > This should pipe the vertices to the fragment shader?
}