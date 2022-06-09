import objLoader from './obj-loader.utils';
import model from './assets/truck.obj';
import { m4Module } from './ext-utils/m4';
import { createShader, createProgram } from './glutils';
import { Vector3d } from './vector3d.dev';
import calc from './calc.utils.js';
import skull from './assets/Skull.jpg';
import { createTexture } from './glutils';

const m4 = m4Module();

export function testGL(
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
): void {
  let lightPoint:Vector3d = new Vector3d(0, 0, -10);

  gl.canvas.addEventListener('mousemove', (e: MouseEvent) => {
    // dom.forEach(it => it.processMove(new Vector3d(e.offsetX, e.offsetY, 0)));
    dom[0].processMove(e);
  });
  gl.canvas.addEventListener('mouseup', (e: MouseEvent) => {
    // dom.forEach(it => it.processMove(new Vector3d(e.offsetX, e.offsetY, 0)));
    dom[0].processUp(e);
  });
  gl.canvas.addEventListener('mousedown', (e: MouseEvent) => {
    // dom.forEach(it => it.processMove(new Vector3d(e.offsetX, e.offsetY, 0)));
    dom[0].processDown(e);
  });
  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  var colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
  var transformUniformLocation = gl.getUniformLocation(program, 'u_transform');
  var colorUniformLocation = gl.getUniformLocation(program, 'u_color');
  var lightPointUniformLocation = gl.getUniformLocation(program, 'u_lightPoint');
  var aUvAttributeLocation = gl.getAttribLocation(program, 'a_uv');

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var modelData = objLoader.getModList(model, false,1);
  // gl.cullFace(gl.BACK);
  var positions = modelData.triangleList;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  var colors = modelData.normalList;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
  // code above this line is initialization code.
  // code below this line is rendering code.

  var uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(modelData.texList),
    gl.STATIC_DRAW
  );

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Turn on culling. By default backfacing triangles
  // will be culled.
  gl.enable(gl.CULL_FACE);

  // Enable the depth buffer
  gl.enable(gl.DEPTH_TEST);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.enableVertexAttribArray(aUvAttributeLocation);

  // Bind the position buffer.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    colorAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    aUvAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  let dom: Array<Model3d> = [];

  let project = m4.perspective(
    Math.PI / 2,
    gl.canvas.width / gl.canvas.height,
    0.05,
    30
  );

  for (let i = 0; i < 1; i++) {
    let model3d = new Model3d(
      gl,
      project,
      modelData,
      transformUniformLocation,
      new Vector3d(i % 3, i / 3, 0),
      colorUniformLocation,
      lightPointUniformLocation
    );

    let isDragStart = false;
    let startPoint: Vector3d;
    let initialAngle: Vector3d = new Vector3d(0,0,)

    model3d.onMouseDown = (e) => {
      initialAngle.y = model3d.angleVector.y;
      initialAngle.x = model3d.angleVector.x
      isDragStart = true;
      startPoint = new Vector3d(e.offsetX, e.offsetY, 0);
      
    }

    model3d.onMouseUp = (e) => {
      isDragStart = false;
    }

    model3d.onMouseMove = (e) => {      
      let vector = new Vector3d(e.offsetX, e.offsetY, 0);
      lightPoint = new Vector3d(e.offsetX - 100, e.offsetY - 100, -100);
      if (isDragStart) {
        model3d.angleVector.y = initialAngle.y + vector.subVector(startPoint).y;//e.offsetX - startPoint.x;
        model3d.angleVector.x =initialAngle.x + vector.subVector(startPoint).x;// e.offsetY - startPoint.y;
       
        //model3d.angle = initialAngle + vector.subVector(startPoint).y / 500;
      }
    }

    dom.push(model3d);
  }

  function render(timeStamp: number) {
    window.requestAnimationFrame((timeStamp) => {
      render(timeStamp);
      dom[0].render(timeStamp, lightPoint); //dom.forEach(it=>it.render(timeStamp));
    });
  }

  render(0);
}

class Model3d {
  public angle: number = 0;
  public angleVector: Vector3d = new Vector3d(0, 0, 0);

  public gl: WebGLRenderingContext;
  public project: any;
  public modelData: any;
  public transformUniformLocation: any;
  public position: Vector3d;
  public colorUniformLocation: WebGLUniformLocation;

  private speed: number = Math.random() * 1;
  public transformed: Array<any> = [];
  private isHovered: boolean;
  private texture: WebGLTexture;
  public onMouseIn: (e: MouseEvent) => void;
  public onMouseOut: (e: MouseEvent) => void;
  public onMouseMove: (e: MouseEvent) => void;
  public onMouseUp: (e: MouseEvent) => void;
  public onMouseDown: (e: MouseEvent) => void;
  lightPointLocation: WebGLUniformLocation;

  constructor(
    gl: WebGLRenderingContext,
    camera: any,
    modelData: any,
    transformUniformLocation: any,
    position: Vector3d,
    colorUniformLocation: WebGLUniformLocation,
    lightPointLocation: WebGLUniformLocation
  ) {
    this.gl = gl;
    this.project = camera;
    this.modelData = modelData;
    this.transformUniformLocation = transformUniformLocation;
    this.lightPointLocation = lightPointLocation;
    this.colorUniformLocation = colorUniformLocation;
    this.position = position.add(0, 0, 0, false);
    this.texture = null;
    createTexture(gl, skull, (texture) => {
      this.texture = texture;
    });
    this.isHovered = false;
  }

  render(timeStamp: number, lightPoint:Vector3d) {
    //this.angle += (1 / 180) * Math.PI * this.speed;
   //console.log(this.angleX)
    let mtx = m4.identity(); //m4.identity();
 
    mtx = m4.translate(mtx, 0, 0, -1);

    // mtx = m4.yRotate(mtx, this.angle);
    mtx = m4.xRotate(mtx, this.angleVector.y/100);
    mtx = m4.yRotate(mtx, this.angleVector.x / 100);
    
    mtx = m4.multiply(this.project, mtx);

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
   
    //for (let i = 0; i < 100; i++){
    let mtx1 = m4.translate(
      m4.identity(),
      this.position.x,
      this.position.y,
      this.position.z
    );
   mtx1 = m4.multiply(mtx1, mtx);
    this.gl.uniformMatrix4fv(this.transformUniformLocation, false, mtx1);
    this.gl.uniform3fv(this.lightPointLocation, new Float32Array([lightPoint.x, lightPoint.y, lightPoint.z]));
    this.gl.uniform4fv(
      this.colorUniformLocation,
      this.isHovered ? [1, 0, 0, 1] : [0, 0, 1, 1]
    );

    this.transformed = calc.getScreenModel(
      this.modelData.triangleList,
      mtx1,
      this.gl.canvas,
      m4
    ); //calc.transformVertexList(this.modelData.triangleList, mtx1);
    // draw
    var primitiveType = this.gl.TRIANGLES;
    var offset = 0;
    var count = this.modelData.triangleList.length / 3;
    this.gl.drawArrays(primitiveType, offset, count);
    //}
  }

  processMove(e: MouseEvent) {
    const pos = new Vector3d(e.offsetX, e.offsetY, 0);
    // console.log(this.transformed[0], pos);
    let crossed = calc.isCrossedMeshByLine(
      this.transformed,
      new Vector3d(pos.x, pos.y, 1000),
      new Vector3d(pos.x, pos.y, -1000)
    );
    // new Vector3d((pos.x - this.gl.canvas.width/2)/this.gl.canvas.width, (pos.y- this.gl.canvas.height/2)/this.gl.canvas.height, -1000),
    // new Vector3d((pos.x - this.gl.canvas.width/2)/this.gl.canvas.width, (pos.y- this.gl.canvas.height/2)/this.gl.canvas.height, 1000))

    if (crossed) {
      this.onMouseMove(e);
      if (this.isHovered === false) {
        this.isHovered = true;
        this.onMouseIn && this.onMouseIn(e);
      }
    } else {
      if (this.isHovered === true) {
        this.isHovered = false;
        this.onMouseOut && this.onMouseOut(e);
      }      
    }
  }

  processUp(e: MouseEvent) {
    if (this.isHovered) {      
      this.onMouseUp && this.onMouseUp(e);
    }

  }

  processDown(e: MouseEvent) {
    if (this.isHovered) {
      this.onMouseDown && this.onMouseDown(e);
    }
  }
}
