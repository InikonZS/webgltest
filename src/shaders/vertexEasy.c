  // an attribute will receive data from a buffer
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec2 a_uv;

  varying vec4 vertexColor;
  uniform mat4 u_transform;
  varying vec2 v_texture;
  
  // all shaders have a main function
  void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  vertexColor = u_transform * a_color;
  vec4 pos = u_transform * a_position;
  gl_Position = pos;//a_position;//pos;
  v_texture = a_uv;
}