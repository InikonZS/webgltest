  // fragment shaders don't have a default precision so we need
  // to pick one. mediump is a good default
  precision mediump float;

  varying vec4 vertexColor;

  void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
    float color = dot(normalize(vec3(0, -1.0, -1.0)),normalize(vertexColor.xyz));//vec4(0.0, 0.0, 0.0, 1.0);
    //if(vertexColor.r<0.1){
      //color = vec4(0.5,0.0,0.0,1.0);//vertexColor;//vec4(1, 0, 0.5, 1); // return redish-purple
   //  } else{
    // color = vec4(0.1,0.0,0.0,1.0);//vertexColor;//vec4(1, 0, 0.5, 1); // return redish-purple  
    // }
    gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    //gl_FragColor = //vec4(0.5,0.5,0.5,1.0);
    gl_FragColor.rgb *= color;
  }