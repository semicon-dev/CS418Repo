#version 300 es
precision highp float;
uniform vec4 color;


uniform vec3 lightdir ; 
uniform vec3 lightcolor ;
uniform vec3 halfway ;


out vec4 fragColor;
in vec3 vnormal ; 
in vec4 testColor ;

void main() {
    float lambert = max(dot(vnormal, lightdir), 0.0) ; 
    float scale = 3.0 ; 
    float blinn = pow(max(dot(vnormal, halfway), 0.0), 75.0) ;
    fragColor = vec4(color.rgb * (lightcolor * lambert) +  (blinn * lightcolor) * scale, color.a);

   // fragColor = testColor ; 
}