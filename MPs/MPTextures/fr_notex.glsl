#version 300 es
precision highp float;
uniform vec4 color;


uniform vec3 lightdir ; // Direction to the light
uniform vec3 lightcolor ; // color of the light
uniform vec3 halfway ; // may not actually use this
uniform vec3 eye_position ; // current position of the eye (time varying)

out vec4 fragColor;
in vec3 vnormal ; 
in vec4 testColor ;
in vec3 position_to_frag ; 

void main() {
    // > Calculate local halfway - - -
    vec3 dir_to_eye = normalize(eye_position - position_to_frag) ;
    vec3 local_halfway = normalize(lightdir + dir_to_eye); 

    float lambert = max(dot(vnormal, lightdir), 0.0) ; 
    float blinn = pow(max(dot(vnormal, local_halfway), 0.0), 100.0) ;
    fragColor = vec4(color.rgb * (lightcolor * lambert) * (1.0 - color.a) +  (blinn * lightcolor) * 3.0 * (color.a), 1.0);
    // Add ambient term also

   // fragColor = testColor ; 
}