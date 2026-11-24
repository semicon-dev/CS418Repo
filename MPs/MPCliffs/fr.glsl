#version 300 es
precision highp float;
uniform vec4 color;
uniform vec4 colorGrass ; 
uniform vec4 colorMud ; 


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

    float lambert = max(dot(normalize(vnormal), lightdir), 0.0) ; 
    float blinnGrass = pow(max(dot(normalize(vnormal), local_halfway), 0.0), 200.0) ;
    float blinnMud = pow(max(dot(normalize(vnormal), local_halfway), 0.0), 50.0) ;
    
    //fragColor = vec4(color.rgb * (lightcolor * lambert) +  (blinn * lightcolor) * scale + color.rgb * 0.15, color.a);

    // > Color in cliffs
    // > Note same as psychedellic, use ternary operators 
    fragColor = (abs(normalize(vnormal)[2]) < 0.3 ? vec4(colorGrass.rgb * (lightcolor * lambert) +  (blinnGrass * lightcolor) , colorGrass.a) : vec4(0.0, 0.0, 0.0, 0.0))
    + (abs(normalize(vnormal)[2]) >= 0.3 ? vec4(colorMud.rgb * (lightcolor * lambert) + (blinnMud * lightcolor) * 0.2 , colorMud.a) : vec4(0.0, 0.0, 0.0, 0.0)) ; 
}