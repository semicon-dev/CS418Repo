#version 300 es
precision highp float;
uniform vec4 color;


uniform vec3 lightdir ; // Direction to the light
uniform vec3 lightcolor ; // color of the light
uniform vec3 halfway ; 
uniform vec3 eye_position ; // current position of the eye (time varying)

out vec4 fragColor;
in vec3 vnormal ; 
in vec4 testColor ;
in vec3 position_to_frag ; 

void main() {
    // > Calculate local halfway - - -
    vec3 dir_to_eye = normalize(eye_position - position_to_frag) ; // > Need this because
    // This gives us the direction to the eye from the current fragment!
    // I  am not even using dir to eye. Where do I use this?
    // > I see, I just wasn't even using this one!!
    vec3 local_halfway = normalize(dir_to_eye + lightdir) ;
    float lambert = max(dot(normalize(vnormal), lightdir), 0.0) ; 
    float scale = 0.3 ; 
    float blinn = pow(max(dot(normalize(vnormal), local_halfway), 0.0), 75.0) ;
    float ambient = 0.2 ; 
    fragColor = vec4(color.rgb * (lightcolor * lambert) * 1.2 + (blinn * lightcolor) * scale + color.rgb * ambient, color.a);
    
    // Add ambient term also

   // fragColor = testColor ; 
}