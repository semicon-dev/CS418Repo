#version 300 es
precision highp float;
uniform vec4 color;
uniform vec3 lightdir ; 
out vec4 fragColor;
in vec3 vnormal ; 

void main() {
    float lambert = dot(vnormal, lightdir) ; 
    fragColor = vec4(color.rgb * lambert, color.a);
}

