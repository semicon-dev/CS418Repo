#version 300 es
precision highp float;

uniform float seconds ;

in vec4 vPos ; 
out vec4 fragColor;

void main() {
    fragColor = vec4(0.6*cos(seconds), 0.7, 1.0, 0.956) ; 
}