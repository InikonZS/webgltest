  // an attribute will receive data from a buffer
  attribute vec4 a_position;
  attribute vec4 a_color;
  attribute vec2 a_uv;

  varying vec4 vertexColor;
  uniform mat4 u_transform;
  varying vec2 v_texture;
  uniform vec3 u_lightPoint;
  varying vec3 v_lightPoint;
  
  // all shaders have a main function
  void main() {
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  vertexColor = u_transform * a_color;
  vec4 pos = u_transform * a_position;
  v_lightPoint = (u_transform * vec4(u_lightPoint, 1)).xyz;
  gl_Position = pos;//a_position;//pos;
  v_texture = a_uv;
}