#version 300 es
precision highp float;

uniform sampler2D currentTexture ; // The texture that we really want here


uniform vec3 lightdir ; // Direction to the light
uniform vec3 lightcolor ; // color of the light
uniform vec3 halfway ; // may not actually use this
uniform vec3 eye_position ; // current position of the eye (time varying)

out vec4 fragColor;
in vec3 vnormal ; 
in vec3 position_to_frag ; 
in vec2 texCoordFrag ; 

void main() {
    // > Calculate local halfway - - -

    vec3 dir_to_eye = normalize(eye_position - position_to_frag) ;
    vec3 local_halfway = normalize(lightdir + dir_to_eye); 

    float lambert = max(dot(vnormal, lightdir), 0.0) ; 
   // fragColor = vec4(texture(currentTexture, texCoordFrag).rgb * (lightcolor * lambert), 1.0); (correct)
    fragColor = texture(currentTexture, texCoordFrag) ;
   // fragColor = texture(currentTexture, texCoordFrag) ; 

   // fragColor = testColor ; 
}