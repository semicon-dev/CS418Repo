#version 300 es
precision highp float;

uniform float seconds ;

in vec4 vPos ; 
out vec4 fragColor;

void main() {
    fragColor.x = .3 * cos(seconds + 25.0 * vPos.x * vPos.y) * vPos.x;

    fragColor.y = 0.5 + sin(vPos.x * 32.7 * vPos.y + seconds) * vPos.y ;

    fragColor.z = 0.25 * sin(vPos.x + vPos.y + seconds) * seconds;

    fragColor.w =  1.0 ;
}