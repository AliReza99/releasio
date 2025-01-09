uniform sampler2D uTexture;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColor;
void main() {
  vec4 textureColor = texture2D(uTexture, vUv);

  // textureColor.r += vElevation * 2.0;
  // textureColor.g += vElevation * 2.0;
  // textureColor.b += vElevation * 2.0;
  textureColor.rgb *= 3.0 * vElevation + 0.7;
  // gl_FragColor = vec4(uColor, 1.0);
  gl_FragColor = textureColor;
}