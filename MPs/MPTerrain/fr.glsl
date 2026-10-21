#version 300 es
precision highp float;
uniform vec4 color;


uniform vec3 lightdir ; 
uniform vec3 lightcolor ;
uniform vec3 halfway ;

uniform vec3 lightdir2 ;
uniform vec3 lightcolor2 ;
uniform vec3 halfway2 ;

out vec4 fragColor;
in vec3 vnormal ; 
in vec4 testColor ;

void main() {
    // float lambert = max(dot(vnormal, lightdir), 0.0) ; 
    // float scale = 3.0 ; 
    // float blinn = pow(max(dot(vnormal, halfway), 0.0), 75.0) ;
    // float blinn2 = pow(max(dot(vnormal, halfway2), 0.0), 100.0) ;
    // float lambert2 = max(dot(vnormal, lightdir2), 0.0) ; 
    // fragColor = vec4(color.rgb * (lightcolor * lambert + lightcolor2 * lambert2) +  (blinn * lightcolor + blinn2 * lightcolor2) * scale, color.a);

    fragColor = testColor ; 
}