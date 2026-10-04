#version 300 es

layout(location=0) in vec4 position;
layout(location=1) in vec4 color;

int x = 1 ;
float p = 1.0 ; 
float s = 1.0 / 14.0 ; 
// > Ok, declaring a float actually lowkey causes issues if I dont put 1.0, and just like '1'

// > Set up our transform matrix ;
// > Looks like it build it and each "row" is actually a matrix colum source : https://en.wikibooks.org/wiki/GLSL_Programming/Vector_and_Matrix_Operations
// > Test with identity matrix first

const mat4 transform = mat4(
    1.0, 0.0, 0.0, 0.0,   // > First column
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0    // > Fourth column
) ;


// > End setting up our transofmr matrix
out vec4 vColor;

void main() {
    vColor = color;
    
    // gl_Position = position;
    temp_Position = vec4(position.x * s, position.y * s, 0 , 1) ;
    gl_Position = vec4(temp_Position * transform) ; 
}