#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec4 color;

int x = 1 ;
float p = 1.0 ; 
float s = 1.0 / 14.0 ; 
// > Ok, declaring a float actually lowkey causes issues if I dont put 1.0, and just like '1'


uniform mat4 transform; // > Transform matrix is set in javascript file



out vec4 vColor;

void main() {
    // > Set the color, as in the example
    vColor = color;
    
    // gl_Position = vec4(position.x * s, position.y * s, 0 , 1);
    vec4 temp_Position = vec4(position.x * s, position.y * s, 0 , 1) ;
    gl_Position = vec4(temp_Position * transform) ; 
}