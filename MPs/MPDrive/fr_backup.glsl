



//// 
////
////
////
////
////
///
#version 300 es
precision highp float;
uniform vec4 color;

uniform vec3 lightdir;      // unit direction TO the light (world space)
uniform vec3 lightcolor;
uniform vec3 eye_position;  // world space

in vec3 vnormal;
in vec3 position_to_frag;   // world space fragment position

out vec4 fragColor;

void main() {
    vec3 n = normalize(vnormal);                                  // renormalize after interpolation
    vec3 l = normalize(lightdir);
    vec3 v = normalize(eye_position - position_to_frag);          // per-fragment direction to eye
    vec3 h = normalize(l + v);                                    // per-fragment halfway vector

    float lambert = max(dot(n, l), 0.0);
    float blinn = pow(max(dot(n, h), 0.0), 75.0);
    // if (lambert <= 0.0) blinn = 0.0;                              // no highlight on unlit side

    float ambient = 0.1;
    vec3 diffuse = color.rgb * lightcolor * (lambert + ambient);
    vec3 spec = lightcolor * blinn;

    fragColor = vec4(diffuse + spec, color.a);
}