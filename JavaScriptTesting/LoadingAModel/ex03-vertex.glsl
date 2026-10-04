#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec4 color;

int x = 1 ;
float p = 1.0 ; 
float s = 1.0 / 14.0 ; 
// > Ok, declaring a float actually lowkey causes issues

out vec4 vColor;

void main() {
    

    vColor = color;
    // gl_Position = position;
    gl_Position = vec4(position.x * s, position.y * s, 0 , 1) ;
}
