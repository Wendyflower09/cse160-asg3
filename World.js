//Xiaohua Huo
//xhuo3@ucsc.edu
// Thank you!

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_UV = a_UV;\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform int u_whichTexture;\n' +
  'void main() {\n' +
  '  if (u_whichTexture == -2){\n'+
  '   gl_FragColor = u_FragColor;\n' +
  '  } else if (u_whichTexture == -1){\n' +
  '   vec4 skyBlue = vec4(0.53, 0.81, 0.92, 1.0);\n' +
  '   vec4 magenta = vec4(1.0, 0.5, 1.0, 1.0);\n' +
  '   gl_FragColor = mix(magenta, skyBlue, v_UV.y);\n' +
  '  } else if (u_whichTexture == 0){\n' +
  '   gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
  '  } else if (u_whichTexture == 1){\n' +
  '   gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +
  '  } else if (u_whichTexture == 2){\n' +
  '   gl_FragColor = texture2D(u_Sampler2, v_UV);\n' +
  '  } else {\n' +
  '   gl_FragColor = vec4(1, .2, .2, 1);\n' +
  '  }\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

var g_isRaining = false;
var g_raindrops = [];

// initial Rain
function initRain(count) {
  g_raindrops = [];
  for (let i = 0; i < count; i++) {
    let drop = {
      x: Math.random() * 32 - 16,
      y: Math.random() * 15 + 5,
      z: Math.random() * 32 - 16,
      speed: 0.05 + Math.random() * 0.05,
      size: 0.02 + Math.random() * 0.02
    };
    g_raindrops.push(drop);
  }
  console.log("Initialized " + count + " raindrops.");
}

function updateRain() {
  for (let drop of g_raindrops) {
    drop.y -= drop.speed;
    if (drop.y < -0.75) {
      drop.x = Math.random() * 32 - 16;
      drop.y = Math.random() * 15 + 5;
      drop.z = Math.random() * 32 - 16;
      drop.speed = 0.05 + Math.random() * 0.05;
      drop.size = 0.02 + Math.random() * 0.02;
    }
  }
}

function drawRain() {
  let color = [0.2, 0.2, 1.0, 1.0];
  for (let drop of g_raindrops) {
    let dropCube = new Cube();
    dropCube.color = color;
    dropCube.textureNum = -2;
    dropCube.matrix.setIdentity();
    dropCube.matrix.translate(drop.x, drop.y, drop.z);
    dropCube.matrix.scale(drop.size, drop.size * 4, drop.size);
    dropCube.renderFast();
  }
}

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  } 

  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0){
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1){
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2){
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture){
      console.log('Failed to get the storage location of u_whichTexture');
      return;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

var mouseControl = false;

function requestMouseControl() {
  canvas.requestPointerLock = canvas.requestPointerLock ||
                              canvas.mozRequestPointerLock ||
                              canvas.webkitRequestPointerLock;
  canvas.requestPointerLock();
}

function exitMouseControl() {
  document.exitPointerLock = document.exitPointerLock ||
                             document.mozExitPointerLock ||
                             document.webkitExitPointerLock;
  document.exitPointerLock();
}

// add or remove Mouse Pointer lock listener
function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas ||
      document.webkitPointerLockElement === canvas) {
    console.log("Pointer locked.");
    document.addEventListener("mousemove", onMouseMove, false);
  } else {
    console.log("Pointer unlocked.");
    document.removeEventListener("mousemove", onMouseMove, false);
  }
}

function extractTranslation(matrix) {
  return new Vector(matrix.elements[12], matrix.elements[13], matrix.elements[14]);
}

// update camera when mouse moving
function onMouseMove(e) {
  let dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
  let dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
  camera.handleMouseMove(dx, dy);
  renderAllShapes();
}

function addActionForHtmlUI(){
  document.addEventListener('pointerlockchange', lockChangeAlert, false);
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
  document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

  canvas.onmousedown = function(ev) {
    if (ev.button === 0) {
      placeBlock();
    } else if (ev.button === 2) {
      deleteBlock();
    }
  };

  canvas.oncontextmenu = function(ev) {
    ev.preventDefault();
    return false;
  };

  let rainBtn = document.getElementById("rainBtn");
  rainBtn.onclick = function() {
    g_isRaining = !g_isRaining;
    if (g_isRaining) {
      initRain(200);
      rainBtn.innerText = "Stop Rain";
    } else {
      g_raindrops = [];
      rainBtn.innerText = "Start Rain";
    }
  };
}

//initial picture to uv texture
function initTextures(){
  var image = new Image();
  if (!image){
    console.log('Failed to create the iamge objject');
    return false;
  }
  image.onload = function(){ sendImageToTEXTURE0(image); };
  image.src = 'buildingBlock.jpg';

  var groundImage = new Image();
  if (!groundImage){
    console.log('Failed to create the iamge objject');
    return false;
  }
  groundImage.onload = function(){ sendImageToTEXTURE1(groundImage); };
  groundImage.src = 'ground.jpg';

  var wallImage = new Image();
  if (!wallImage){
    console.log('Failed to create the iamge objject');
    return false;
  }
  wallImage.onload = function(){ sendImageToTEXTURE2(wallImage); };
  wallImage.src = 'wallBlock.jpg';
  
  return true;
}

// building block texture
function sendImageToTEXTURE0(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log('Failed to create the texture obect');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);

  console.log('finished loadTexture0');
}

// ground texture
function sendImageToTEXTURE1(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log('Failed to create the ground texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);
  console.log('Finished loading ground texture');
}

// wall block texture
function sendImageToTEXTURE2(image){
  var texture = gl.createTexture();
  if (!texture){
    console.log('Failed to create the ground texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler2, 2);
  console.log('Finished loading ground texture');
}



function main() {
  //set up
  setupWebGL();  

  connectVariablesToGLSL();

  addActionForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  // canvas.onmousedown = click;
  // canvas.onmousemove = function(ev){if(ev.buttons == 1){click(ev)}};
  document.onkeydown = keydown;

  initTextures(gl,0);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1.0);

  requestAnimationFrame(tick);
}



var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

function tick(){
  g_seconds = performance.now() / 1000.0 - g_startTime;
  // console.log(g_seconds);

  // updateAnimationAngles();

  if (g_isRaining) {
    updateRain();
  }

  renderAllShapes();

  requestAnimationFrame(tick);
}

function click(ev) {
  //Extract the event click and return it in WebGL coordinates
  [x, y] = convertCoordinatesEventToGL(ev);

  g_globalAngleY = x * 180;
  // g_globalAngleX = y * 180;

  renderAllShapes();
}

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

var camera = new Camera();
camera.eye = new Vector(-13.5, 0, 5);
camera.at = new Vector(0, 0, 0);

// detect keyboard click and give the 
function keydown(ev) {
  if (ev.keyCode === 77) {
    mouseControl = !mouseControl;
    if (mouseControl) {
      requestMouseControl();
      console.log("Mouse control ENABLED");
    } else {
      exitMouseControl();
      console.log("Mouse control DISABLED");
    }
    return;
  } else if (ev.keyCode == 87 ){
    camera.forward();
  } else if (ev.keyCode == 83 ){
    camera.back();
  } else if (ev.keyCode == 65 ){
    camera.left();
  } else if (ev.keyCode == 68 ){
    camera.right();
  } else if (ev.keyCode == 81 ){
    camera.rotateLeft();
  } else if (ev.keyCode == 69 ){
    camera.rotateRight();
  } 
  renderAllShapes();
  console.log(ev.keyCode);
}


var g_map = [
  //1
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  //2
  [2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2],
  //3
  [2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,0,2,2],
  //4
  [2,2,0,0,0,0,0,0,2,2,0,0,2,2,0,0,2,2,0,0,0,0,2,2,0,0,0,0,0,0,2,2],
  //5
  [2,2,0,0,2,2,0,0,2,2,0,0,2,2,0,0,2,2,2,2,0,0,2,2,0,0,2,2,2,2,2,2],
  //6
  [2,2,0,0,2,2,0,0,2,2,0,0,2,2,2,2,2,2,2,2,0,0,2,2,0,0,2,2,2,2,2,2],
  //7
  [2,2,0,0,2,2,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
  //8
  [2,2,0,0,2,2,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
  //9
  [2,2,0,0,2,2,0,0,2,2,0,0,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0,0,2,2],
  //10
  [2,2,0,0,2,2,0,0,2,2,0,0,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0,0,2,2],
  //11
  [2,2,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2,2],
  //12
  [2,2,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2,2],
  //13
  [2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,0,0,2,2],
  //14
  [2,2,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,0,0,2,2],
  //15
  [2,2,2,2,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,2,2],
  //16
  [2,2,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,2,2],
  //17
  [2,2,0,0,0,0,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2],
  //18
  [2,2,0,0,0,0,2,2,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2],
  //19
  [2,2,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,2,2],
  //20
  [2,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,2,2],
  //21
  [2,2,0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,2,2,2,2],
  //22
  [2,2,0,0,0,0,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0,0,0,2,2,0,0,2,2,2,2],
  //23
  [2,2,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,2,2],
  //24
  [2,2,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0,0,0,2,2,0,0,0,0,2,2],
  //25
  [2,2,0,0,0,0,0,0,0,0,2,2,2,2,0,0,2,2,0,0,2,2,0,0,2,2,2,2,0,0,2,2],
  //26
  [2,2,0,0,0,0,0,0,0,0,2,2,0,0,0,0,2,2,0,0,2,2,0,0,2,2,2,2,0,0,2,2],
  //27
  [2,2,0,0,2,2,0,0,0,0,2,2,0,0,0,0,2,2,0,0,2,2,0,0,0,0,0,0,0,0,2,2],
  //28
  [2,2,0,0,2,2,0,0,0,0,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0,0,0,0,0,2,2],
  //29
  [2,2,0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,2,2,0,0,2,2,0,0,2,2,2,2],
  //30
  [2,2,0,0,0,0,0,0,0,0,2,2,0,0,2,2,0,0,0,0,2,2,0,0,2,2,0,0,2,2,2,2],
  //31
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  //32
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
  ];

function drawMap() {
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      let val = g_map[x][y];
      if (val > 0) {
        for (let i = 0; i < val; i++) {
          let cube = new Cube();
          cube.color = [0.0, 1.0, 1.0, 1.0];
          cube.textureNum = 2;
          cube.matrix.translate(x - 16, -0.75 + i, y - 16);
          cube.renderFast();
        }
      }
    }
  }
}

var placedBlocks = [];

// selecte a block
function getSelectedBlock(maxDistance = 100) {
  let offset = new Vector(16, 0.75, 16);

  let gridOrigin = camera.eye.add(offset);
  let rayDir = camera.at.subtract(camera.eye).normalize();

  let x = Math.floor(gridOrigin.x);
  let y = Math.floor(gridOrigin.y);
  let z = Math.floor(gridOrigin.z);

  let stepX = (rayDir.x >= 0) ? 1 : -1;
  let stepY = (rayDir.y >= 0) ? 1 : -1;
  let stepZ = (rayDir.z >= 0) ? 1 : -1;

  let tDeltaX = (rayDir.x !== 0) ? Math.abs(1 / rayDir.x) : Infinity;
  let tDeltaY = (rayDir.y !== 0) ? Math.abs(1 / rayDir.y) : Infinity;
  let tDeltaZ = (rayDir.z !== 0) ? Math.abs(1 / rayDir.z) : Infinity;

  let voxelBoundaryX = (stepX > 0) ? (x + 1) : x;
  let voxelBoundaryY = (stepY > 0) ? (y + 1) : y;
  let voxelBoundaryZ = (stepZ > 0) ? (z + 1) : z;
  let tMaxX = (rayDir.x !== 0) ? Math.abs((voxelBoundaryX - gridOrigin.x) / rayDir.x) : Infinity;
  let tMaxY = (rayDir.y !== 0) ? Math.abs((voxelBoundaryY - gridOrigin.y) / rayDir.y) : Infinity;
  let tMaxZ = (rayDir.z !== 0) ? Math.abs((voxelBoundaryZ - gridOrigin.z) / rayDir.z) : Infinity;

  let t = 0;
  while(t < maxDistance) {
    let worldBlockPos = new Vector(x - offset.x, y - offset.y, z - offset.z);

    if (x >= 0 && x < 32 && z >= 0 && z < 32) {
      let height = g_map[x][z];
      if (y < height) {
        let normal = null;
        if (tMaxX < tMaxY && tMaxX < tMaxZ) {
          normal = new Vector(-stepX, 0, 0);
        } else if (tMaxY < tMaxZ) {
          normal = new Vector(0, -stepY, 0);
        } else {
          normal = new Vector(0, 0, -stepZ);
        }
        return { blockPos: worldBlockPos, normal: normal };
      }
    }

    for (let block of placedBlocks) {
      if (block.gridPos.x === worldBlockPos.x &&
          block.gridPos.y === worldBlockPos.y &&
          block.gridPos.z === worldBlockPos.z) {
        let normal = null;
        if (tMaxX < tMaxY && tMaxX < tMaxZ) {
          normal = new Vector(-stepX, 0, 0);
        } else if (tMaxY < tMaxZ) {
          normal = new Vector(0, -stepY, 0);
        } else {
          normal = new Vector(0, 0, -stepZ);
        }
        return { blockPos: worldBlockPos, normal: normal };
      }
    }

    if (tMaxX < tMaxY) {
      if (tMaxX < tMaxZ) {
        x += stepX;
        t = tMaxX;
        tMaxX += tDeltaX;
      } else {
        z += stepZ;
        t = tMaxZ;
        tMaxZ += tDeltaZ;
      }
    } else {
      if (tMaxY < tMaxZ) {
        y += stepY;
        t = tMaxY;
        tMaxY += tDeltaY;
      } else {
        z += stepZ;
        t = tMaxZ;
        tMaxZ += tDeltaZ;
      }
    }
  }
  return null;
}

// select a cube face which will be used to add block
function getSelectedFace(blockPos, rayOrigin, rayDir) {
  let faces = [];
  
  let min = blockPos;
  let max = new Vector(blockPos.x + 1, blockPos.y + 1, blockPos.z + 1);
  

  // front
  if (rayDir.z !== 0) {
    let t = (max.z - rayOrigin.z) / rayDir.z;
    if (t > 0) {
      let hitPoint = rayOrigin.add(rayDir.multiply(t));
      if (hitPoint.x >= min.x && hitPoint.x <= max.x &&
          hitPoint.y >= min.y && hitPoint.y <= max.y) {
        faces.push({ normal: new Vector(0, 0, 1), t: t, hitPoint: hitPoint });
      }
    }
  }
  // top
  if (rayDir.y !== 0) {
    let t = (max.y - rayOrigin.y) / rayDir.y;
    if (t > 0) {
      let hitPoint = rayOrigin.add(rayDir.multiply(t));
      if (hitPoint.x >= min.x && hitPoint.x <= max.x &&
          hitPoint.z >= min.z && hitPoint.z <= max.z) {
        faces.push({ normal: new Vector(0, 1, 0), t: t, hitPoint: hitPoint });
      }
    }
  }
  // letf
  if (rayDir.x !== 0) {
    let t = (min.x - rayOrigin.x) / rayDir.x;
    if (t > 0) {
      let hitPoint = rayOrigin.add(rayDir.multiply(t));
      if (hitPoint.y >= min.y && hitPoint.y <= max.y &&
          hitPoint.z >= min.z && hitPoint.z <= max.z) {
        faces.push({ normal: new Vector(-1, 0, 0), t: t, hitPoint: hitPoint });
      }
    }
  }
  // right
  if (rayDir.x !== 0) {
    let t = (max.x - rayOrigin.x) / rayDir.x;
    if (t > 0) {
      let hitPoint = rayOrigin.add(rayDir.multiply(t));
      if (hitPoint.y >= min.y && hitPoint.y <= max.y &&
          hitPoint.z >= min.z && hitPoint.z <= max.z) {
        faces.push({ normal: new Vector(1, 0, 0), t: t, hitPoint: hitPoint });
      }
    }
  }
  // back
  if (rayDir.z !== 0) {
    let t = (min.z - rayOrigin.z) / rayDir.z;
    if (t > 0) {
      let hitPoint = rayOrigin.add(rayDir.multiply(t));
      if (hitPoint.x >= min.x && hitPoint.x <= max.x &&
          hitPoint.y >= min.y && hitPoint.y <= max.y) {
        faces.push({ normal: new Vector(0, 0, -1), t: t, hitPoint: hitPoint });
      }
    }
  }
  // bottom
  if (rayDir.y !== 0) {
    let t = (min.y - rayOrigin.y) / rayDir.y;
    if (t > 0) {
      let hitPoint = rayOrigin.add(rayDir.multiply(t));
      if (hitPoint.x >= min.x && hitPoint.x <= max.x &&
          hitPoint.z >= min.z && hitPoint.z <= max.z) {
        faces.push({ normal: new Vector(0, -1, 0), t: t, hitPoint: hitPoint });
      }
    }
  }
  
  if (faces.length === 0) return null;
  
  // choose the smallest intersection
  let hitFace = faces[0];
  for (let i = 1; i < faces.length; i++) {
    if (faces[i].t < hitFace.t) {
      hitFace = faces[i];
    }
  }
  return hitFace;
}

function placeBlock() {
  let selection = getSelectedBlock();
  if (selection === null) {
    console.log("There is no block");
    return;
  }
  
  let rayOrigin = camera.eye;
  let rayDir = camera.at.subtract(camera.eye).normalize();
  
  let hitFace = getSelectedFace(selection.blockPos, rayOrigin, rayDir);
  if (hitFace === null) {
    console.log("There is no surface you can place a block");
    return;
  }
  
  let newBlockPos = selection.blockPos.add(hitFace.normal);
  
  let newCube = new Cube();
  newCube.color = [0.8, 0.8, 0.8, 1.0];
  newCube.textureNum = 0;
  newCube.matrix.setIdentity();
  newCube.matrix.translate(newBlockPos.x, newBlockPos.y, newBlockPos.z);
  newCube.gridPos = newBlockPos;
  placedBlocks.push(newCube);
  
  console.log("Placed a block");
}

function deleteBlock() {
  let selection = getSelectedBlock();
  if (selection === null) {
    console.log("Can't find a block");
    return;
  }
  let index = -1;
  for (let i = 0; i < placedBlocks.length; i++) {
    let block = placedBlocks[i];
    if (block.gridPos.x === selection.blockPos.x &&
        block.gridPos.y === selection.blockPos.y &&
        block.gridPos.z === selection.blockPos.z) {
      if (block.deletable) {
        index = i;
        break;
      } else {
        console.log("This block can't be deleted");
        return;
      }
    }
  }
  if (index >= 0) {
    placedBlocks.splice(index, 1);
    console.log("Block deleted.");
  } else {
    console.log("This block can't be deleted");
  }
}


function renderAllShapes(){
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 1000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(camera.eye.x, camera.eye.y, camera.eye.z,
                    camera.at.x, camera.at.y, camera.at.z,
                    camera.up.x, camera.up.y, camera.up.z);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4();
  globalRotMat.setIdentity();
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  
  var body = new Cube();
  body.matrix.translate(-12, -0.6, -1);
  body.matrix.rotate(90, 0, 1, 0);
  var body_head = new Matrix4(body.matrix);
  var body_buttom = new Matrix4(body.matrix);
  var R_F_Leg_Up_Co = new Matrix4(body.matrix);
  var L_F_Leg_Up_Co = new Matrix4(body.matrix);
  body.matrix.rotate(-20,1,0,0);
  body.matrix.scale(0.3, 0.8, 0.3);
  body.color = [0.9, 0.9, 0.9, 1.0];
  body.render();

  var R_F_leg_up = new Cube();
  R_F_leg_up.color = [0.9, 0.9, 0.9, 1];
  R_F_leg_up.matrix = R_F_Leg_Up_Co;
  R_F_leg_up.matrix.translate(-0.03, 0.3, -0.3);
  R_F_leg_up.matrix.translate(0, 0.3, 0);
  R_F_leg_up.matrix.rotate(0, 1, 0, 0);
  R_F_leg_up.matrix.translate(0, -0.3, 0);
  var R_F_leg_Mid_Co = new Matrix4(R_F_leg_up.matrix);
  R_F_leg_up.matrix.scale(0.15, 0.35, 0.1);
  R_F_leg_up.render();

  var R_F_leg_Mid = new Cube();
  R_F_leg_Mid.color = [0.575, 0.575, 0.575, 1];
  R_F_leg_Mid.matrix = R_F_leg_Mid_Co;
  R_F_leg_Mid.matrix.translate(0.001, -0.3, 0.0001);
  R_F_leg_Mid.matrix.translate(0, 0.3, 0);
  R_F_leg_Mid.matrix.rotate(0, 1, 0, 0);
  R_F_leg_Mid.matrix.translate(0, -0.3, 0);
  var R_Foot_Co = new Matrix4(R_F_leg_Mid.matrix);
  R_F_leg_Mid.matrix.scale(0.149, 0.35, 0.1);
  R_F_leg_Mid.render();

  var R_Foot = new Cube();
  R_Foot.color = [0.45, 0.45, 0.45, 1];
  R_Foot.matrix = R_Foot_Co;
  R_Foot.matrix.translate(-0.05, -0.1, -0.05);
  R_Foot.matrix.scale(0.2, 0.1, 0.15);
  R_Foot.render();

  var L_F_leg_up = new Cube();
  L_F_leg_up.matrix = L_F_Leg_Up_Co;
  L_F_leg_up.color = [0.9, 0.9, 0.9, 1];
  L_F_leg_up.matrix.translate(0.17, 0.3, -0.3);
  L_F_leg_up.matrix.scale(0.15, 0.35, 0.1);
  var L_F_leg_Mid_Co = L_F_leg_up.matrix;
  L_F_leg_up.render();

  var L_F_leg_Mid = new Cube();
  L_F_leg_Mid.matrix = L_F_leg_Mid_Co;
  L_F_leg_Mid.color = [0.575, 0.575, 0.575, 1];
  L_F_leg_Mid.matrix.translate(0, -1, 0);
  var L_Foot_Co = new Matrix4(L_F_leg_Mid.matrix);
  L_F_leg_Mid.render();

  var L_Foot = new Cube();
  L_Foot.matrix = L_Foot_Co;
  L_Foot.color = [0.45, 0.45, 0.45, 1];
  L_Foot.matrix.scale(1.2, 0.3, 1.4);
  L_Foot.matrix.translate(-0.0001, -0.5, -0.2)
  L_Foot.render();

  var head = new Cube();
  head.matrix = body_head;
  head.matrix.translate(-0.075, 0.7, -0.4);
  head.matrix.translate(0.25, 0.25, 0.25);
  head.matrix.rotate(-5, 1, 0, 0);
  head.matrix.rotate(0, 0, 1, 0);
  head.matrix.rotate(0, 1, 0, 0);
  head.matrix.translate(-0.25, -0.25, -0.25)
  head.matrix.scale(0.45, 0.45, 0.45);
  var head_face = new Matrix4(head.matrix);
  var leftEarCo = new Matrix4(head.matrix);
  var rightEarCo = new Matrix4(head.matrix);
  head.color = [0.9, 0.9, 0.9, 1.0];
  head.render();

  var leftEar = new Ear();
  leftEar.matrix = leftEarCo;
  leftEar.color = [0.5, 0.5, 0.5, 1];
  leftEar.matrix.translate(0.85, 1, 0, 0);
  leftEar.matrix.scale(0.35, 0.5, 0.7);
  leftEar.render();

  var rightEar = new Ear();
  rightEar.matrix = rightEarCo;
  rightEar.color = [0.5, 0.5, 0.5, 1];
  rightEar.matrix.translate(0.15, 1, 0, 0);
  rightEar.matrix.scale(0.35, 0.5, 0.7);
  rightEar.render();

  var face = new Cube();
  face.matrix = head_face;
  face.matrix.translate(0.15, 0.15, -0.05);
  face.matrix.scale(0.7, 0.7, 0.1);
  var leftEyeCo = new Matrix4(face.matrix);
  var rightEyeCo = new Matrix4(face.matrix);
  var mouthCo = new Matrix4(face.matrix);
  face.color = [0.5, 0.5, 0.5, 1];
  face.render();

  var leftEye = new Cube();
  leftEye.matrix = leftEyeCo;
  leftEye.matrix.scale(0.15, 0.5, 0.1);
  leftEye.matrix.translate(4.5, 0.5, -0.2);
  leftEye.color = [1,1,1,1];
  leftEye.render();

  var rightEye = new Cube();
  rightEye.matrix = rightEyeCo;
  rightEye.matrix.scale(0.15, 0.5, 0.1);
  rightEye.matrix.translate(1.5, 0.5, -0.2);
  rightEye.color = [1,1,1,1];
  rightEye.render();

  var mouth = new Cube();
  mouth.matrix = mouthCo;
  mouth.matrix.scale(0.1, 0.1, 0.1);
  mouth.matrix.translate(4.75, 1, -0.2);
  mouth.color = [1,1,1,1];
  mouth.render();

  var buttom = new Cube();
  buttom.matrix = body_buttom;
  buttom.matrix.translate(-0.1, -0.1, -0.1);
  buttom.matrix.scale(0.5, 0.4, 0.5);
  var buttom_buttom2 = new Matrix4(buttom.matrix);
  var tailCo = new Matrix4(buttom.matrix);
  buttom.color = [0.4, 0.4, 0.4, 1];
  buttom.render();

  var buttom2 = new Cube();
  buttom2.matrix = buttom_buttom2;
  buttom2.matrix.translate(0.075, 0.2, -0.05);
  buttom2.matrix.scale(0.85, 1, 0.85);
  var buttom2_buttom3 = new Matrix4(buttom2.matrix);
  buttom2.color = [0.5, 0.5, 0.5, 1];
  buttom2.render();

  var buttom3 = new Cube();
  buttom3.matrix = buttom2_buttom3;
  buttom3.color = [0.65, 0.65, 0.65, 1];
  buttom3.matrix.translate(0.075, 0.4, -0.1);
  buttom3.matrix.scale(0.85, 0.85, 0.85);
  buttom3.render();

  var tail = new Cube();
  tail.matrix = tailCo;
  tail.color = [0.3, 0.3, 0.3, 1];
  tail.matrix.translate(0.4, 0, 0.7);
  tail.matrix.rotate(45, 0, 1, 0);
  var tail_Mid_Co = new Matrix4(tail.matrix);
  tail.matrix.translate(0, 0, 0.3)
  tail.matrix.scale(0.2, 0.2, 0.5);
  tail.render();

  var tail_Mid = new Cube();
  tail_Mid.color = [0.3, 0.3, 0.3, 1];
  tail_Mid.matrix = tail_Mid_Co;
  tail_Mid.matrix.translate(0, 0, 0.8);
  tail_Mid.matrix.rotate(45, 0, 1, 0);
  var tail_Mid2_Co = new Matrix4(tail_Mid.matrix);
  tail_Mid.matrix.scale(0.2, 0.2, 0.5);
  tail_Mid.render();

  var tail_Mid2 = new Cube();
  tail_Mid2.color = [0.3, 0.3, 0.3, 1];
  tail_Mid2.matrix = tail_Mid2_Co;
  tail_Mid2.matrix.translate(0, 0, 0.5);
  tail_Mid2.matrix.rotate(45, 0, 1, 0);
  var tail_End_Co = new Matrix4(tail_Mid2.matrix);
  tail_Mid2.matrix.scale(0.2, 0.2, 0.5);
  tail_Mid2.render();

  var tail_End = new Cube();
  tail_End.color = [0.3, 0.3, 0.3, 1];
  tail_End.matrix = tail_End_Co;
  tail_End.matrix.translate(0, 0, 0.5);
  tail_End.matrix.rotate(45, 0, 1, 0);
  tail_End.matrix.scale(0.2, 0.2, 0.5);
  tail_End.render();
  
  
  /*
  // Draw the body cube
  var body = new Cube();
  body.color = [1.0, 0.0, 0.0, 1.0];
  body.textureNum = 0;
  body.matrix.translate(-0.25, -0.75, 0.0);
  body.matrix.rotate(-5, 1, 0, 0);
  body.matrix.scale(0.5, 0.3, 0.5);
  body.renderFast();

  //Draw a left arm
  var leftArm = new Cube();
  leftArm.color = [1.0, 1.0, 0.0, 1.0];
  leftArm.matrix.setTranslate(0.0, -0.5, 0.0);
  leftArm.matrix.rotate(-5, 1, 0, 0);
  var yellowCoordinates = new Matrix4(leftArm.matrix);
  leftArm.matrix.scale(0.25, 0.7, 0.5);
  leftArm.matrix.translate(-0.5, 0, 0);
  leftArm.renderFast();

  var box = new Cube();
  box.color = [1, 0, 1, 1];
  box.textureNum = -2;
  box.matrix = yellowCoordinates;
  box.matrix.translate(0, 0.65, 0);
  box.matrix.scale(.3,.3,.3);
  box.matrix.translate(-0.5, 0, -0.001);
  box.renderFast();
*/

  var ground = new Cube();
  ground.color = [0, 0.5, 0, 1];
  ground.textureNum = -2;
  ground.matrix.translate(0, -0.76, 0);
  ground.matrix.scale(32, 0, 32);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.renderFast();

  var sky = new Cube()
  if (!g_isRaining){
    sky.color = [0.68, 0.85, 0.90, 1.0];
    sky.textureNum = -1;
  } else {
    sky.color = [0.4, 0.4, 0.4, 1.0];
    sky.textureNum = -2;
  }
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.renderFast();

  drawMap();

  for (let block of placedBlocks) {
    block.deletable = true;
    block.renderFast();
  }

  if (g_isRaining) {
    drawRain();
  }

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");
}

function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm){
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}