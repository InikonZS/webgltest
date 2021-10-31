export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function isPowerOf2(value: number) {
  return (value & (value - 1)) == 0;
}

export function createTexture(
  gl: WebGLRenderingContext,
  textureUrl: string,
  onLoad: (texture: WebGLTexture) => void
) {
  // Create a texture.
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([0, 0, 255, 255])
  );
  // Asynchronously load an image
  //var image = new Image();
  let image = document.createElement('img');
  //image.style='display:none';
  image.crossOrigin = '';
  //document.body.appendChild(image);
  image.addEventListener('load', function () {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // проверяем, что размер изображения равен степени двойки в обоих измерениях
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Да, степень двойки. Генерируем мипмап.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // Нет, это не степень двойки. Отключаем мипмапы и устанавливаем режим CLAMP_TO_EDGE
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
    onLoad(texture);
  });
  image.src = textureUrl;
}
