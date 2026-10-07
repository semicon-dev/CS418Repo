#version 300 es
precision highp float;

uniform float seconds ;

in vec4 vPos ; 
out vec4 fragColor;

void main() {
    fragColor.x = 0.6*cos( 4.0 * (seconds)) ;
    fragColor.yzw = vec3(0.7, 0.5, 0.956) ;
}