#version 300 es
layout(location=0) in vec4 position;
layout(location=1) in vec3 colors ; 
layout(location=2) in vec2 texture ;
layout(location=3) in vec3 normal ;
layout(location=4) in vec3 test ; // > debugging
uniform mat4 MM ; // > Model Matrix
uniform mat4 VM ; // > View Matrix
uniform mat4 p ;

out vec3 vnormal ;
out vec4 testColor ;
out vec3 position_to_frag ; // send position on vertices to fragment shader to use it in world space calculations - - 
out vec4 color ;
out vec2 texCoordFrag ;
void main() {
    gl_Position = p*VM*MM* position ; // > GL position still needs the view and model matrices applied to it
    vnormal = normalize(mat3(MM) * normal) ; // > rotate normals via the model matrix
   // testColor = position ; // > NO LONGER USING THIS!!
    position_to_frag = (MM*position).xyz ; // give our vertex position to fragment shader for blinn phong calculations
    // > NEED TO DO MM*position to make sure it is in WORLD coords, not OBJECT coord
    color = vec4(colors, 1.0) ;
    texCoordFrag = texture ;
}