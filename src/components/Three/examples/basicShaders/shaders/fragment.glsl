precision mediump float;

uniform sampler2D uTexture;
varying vec2 vUv;

uniform vec3 uColor;
void main() {
  vec4 textureColor = texture2D(uTexture, vUv);
  // gl_FragColor = vec4(uColor, 1.0);
  gl_FragColor = textureColor;
}