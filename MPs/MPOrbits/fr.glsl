#version 300 es
precision highp float;
uniform vec4 color;
in vec4 vColor ; // > Note!! modified to json goem compliancy
out vec4 fragColor;
void main() {
    fragColor = vColor; // !! swap to color for json compliancy
}