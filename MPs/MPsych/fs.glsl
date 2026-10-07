#version 300 es
precision highp float;

uniform float seconds ;

in vec4 vPos ; 
out vec4 fragColor;

void main() {
    fragColor.x = vPos.x * cos(seconds * 3.0 - vPos.y) 
    + vPos.y * 3.0 * cos(seconds * 2.5) * cos(5.0 * vPos.x - 3.0*vPos.y) 
    + vPos.x * vPos.y * sin(2.0 * seconds) 
    + vPos.x * vPos.x * sin(seconds) + 0.5 * sin(vPos.x * vPos.y); 

    fragColor.y = 0.5 + vPos.x * vPos.x * sin(seconds * 3.2) * sin(3.2 * vPos.y)
    + vPos.x * vPos.y + vPos.y * vPos.y * cos(seconds * 1.5) * cos(4.5 * vPos.x)
    + cos(seconds) + 0.5 ;

    fragColor.z = 0.25 * vPos.x * vPos.y * sin(seconds) * cos(vPos.x * vPos.y) 
    + .5;

    fragColor.w =  1.0 ;
}