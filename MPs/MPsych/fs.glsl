#version 300 es
precision highp float;

uniform float seconds ;

in vec4 vPos ; 
out vec4 fragColor;

void main() {
    fragColor.x = (cos(5.0 * seconds + (vPos.x - vPos.y) * 2.0)) ;
    fragColor.y = (vPos.x * vPos.y * sin(3.0 * seconds) + vPos.x * 10.0 * cos(seconds * vPos.x * vPos.y * 25.0 )) ; 
    fragColor.zw = vec2(0.5, 1.0) ;
}