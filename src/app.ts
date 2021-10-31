import Control from './components/control';
import {testGL} from './gl';
import vertexEasy from './shaders/vertexEasy.c';
import fragmentEasy from './shaders/fragmentEasy.c';

console.log(vertexEasy);

export default class App extends Control{
  canvas: Control;
  context: WebGLRenderingContext;
  constructor(parentNode:HTMLElement){
    super(parentNode);
    this.canvas = new Control(this.node, 'canvas');
    this.context = (this.canvas.node as HTMLCanvasElement).getContext('webgl');
    testGL(this.context, vertexEasy, fragmentEasy);
  }
}