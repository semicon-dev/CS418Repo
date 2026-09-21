#version 300 es
# Output of vertex shader is input to fragment shader

layout(location=0) in vec4 position ;
layout(location=1) in vec4 color ;

out vec4 vColor ;

void main{
    vColor = color ;
    gl_position = position ;
}