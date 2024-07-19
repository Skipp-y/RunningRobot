"use strict";

/*
 * Course: CS 4722
 * Section: 01
 * Name: Spencer Williams
 * Professor: Dr. Shaw
 * Assignment #: Module 8 Assignment 2
 */


var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;

var modelViewMatrixLoc;
var projectionMatrixLoc;

var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var torsoId = 0;
var headId = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

var eye1Id = 11;
var eye2Id = 12;
var mouthId = 13;

var torsoHeight = 5.0;
var torsoWidth = 1.0;
var upperArmHeight = 2.4;
var lowerArmHeight = 1.6;
var upperArmWidth = 0.5;
var lowerArmWidth = 0.5;
var upperLegWidth = 0.5;
var lowerLegWidth = 0.5;
var lowerLegHeight = 2.0;
var upperLegHeight = 3.0;
var headHeight = 1.5;
var headWidth = 1.0;

var eyeWidth = 0.1;
var eyeDepth = 0.05;
var mouthWidth = 0.3;
var mouthHeight = 0.1;
var mouthDepth = 0.05;

var numFigureNodes = 14;

var figureTheta = [50, 0, 180, 0, 180, 0, 180, 0, 180, 0, 0, 0, 0, 0];
var figure = [];
var figurePos = [0, 0, 0];
var fTheta;

var mvStack = [];

var vBuffer;

var pointsArray = [];

var black = vec4(0.0, 0.0, 0.0, 1.0);
var white = vec4(1.0, 1.0, 1.0, 1.0);
var red = vec4(1.0, 0.0, 0.0, 1.0);
var yellow = vec4(1.0, 1.0, 0.0, 1.0);
var lightblue = vec4(0.0, 0.0, 1.0, 1.0);
var darkblue = vec4(0.0, 0.0, 0.5, 1.0);
var lightgreen = vec4(0.0, 1.0, 0.0, 1.0);
var darkgreen = vec4(0.0, 0.5, 0.0, 1.0);
var lightcyan = vec4(0.0, 1.0, 1.0, 1.0);
var darkcyan = vec4(0.0, 0.5, 0.5, 1.0);
var brown = vec4(0.65, 0.16, 0.16, 1);
var colorLoc;

var cubeVerts = 0;
var sphereVerts = 0;
var cylinderVerts = 0;
var cylinderEdgeVerts = 0;

var groundWidth = 100;
var groundHeight = .5;
var groundFloor = -4.6;

var groundId = 0;
var columnId1 = 1;
var columnId2 = 2;
var columnId3 = 3;
var columnId4 = 4;
var columnId5 = 5;
var columnId6 = 6;
var columnId7 = 7;
var columnId8 = 8;
var columnId9 = 9;
var columnId10 = 10;

var columnDiameter = 2;
var columnHeight = 18;

var colPosArray = [null, // dummy value
    vec3(5, 0, 5), vec3(40, 0, 40), vec3(30, 0, 30),
    vec3(20, 0, 40), vec3(10, 0, 40), vec3(0, 0, 40),
    vec3(-10, 0, 40), vec3(-20, 0, 40), vec3(-30, 0, 40),
    vec3(-40, 0, 40)];


//var numSceneNodes = 11; replace?

var scene = [];

var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var eye;

var xAngle = 0.0;
var yAngle = 0.5;
var eyeRadius = 50.0;

var fovy = 37;
var aspect = 1.3;
var pnear = 0.01;
var pfar = 1000.0;

var trackingMouse = false;
var curx = 0;
var cury = 0;

var armStack = [];
var legStack = [];

var cubeMap;
var cubeFrontImage;
var cubeBackImage;
var cubeTopImage;
var cubeBottomImage;
var cubeLeftImage;
var cubeRightImage;

var showSkyLoc;
var skyboxScale = 600;

var xMax = 48;
var xMin = -48;
var zMax = 48;
var zMin = -48;

var walkDistance = 0.25;
var runDistance = 1.0;

var sphereId1 = 11;
var sphereId2 = 12;
var sphereId3 = 13;
var sphereId4 = 14;
var sphereId5 = 15;
var sphereId6 = 16;
var sphereId7 = 17;
var sphereId8 = 18;
var sphereId9 = 19;
var sphereId10 = 20;

// the null values are dummy values
var spherePosArray = [null, null, null, null, null, null,
    null, null, null, null, null,
    vec3(5, 13.3, 5), vec3(40, 13.3, 40),
    vec3(30, 13.3, 30), vec3(20, 13.3, 40),
    vec3(10, 13.3, 40), vec3(0, 13.3, 40),
    vec3(-10, 13.3, 40), vec3(-20, 13.3, 40),
    vec3(-30, 13.3, 40), vec3(-40, 13.3, 40)];

var sphereDiameter = 1;
var sphereHeight = 1.25;
var sphereRot = 0;

var numSceneNodes = 21;

var grayish = vec4(0.8, 0.6, 0.6, 1.0);

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2', {});
    if (!gl) { alert("WebGL2 is unavailable"); }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");

    gl.useProgram(program);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    instanceMatrix = mat4();
    modelViewMatrix = mat4();

    projectionMatrix = perspective(fovy, aspect, pnear, pfar);
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    makeCube();

    cubeVerts = pointsArray.length;

    makeSphere();
    sphereVerts = pointsArray.length - cubeVerts;

    makeCylinder(true);
    cylinderVerts = pointsArray.length - cubeVerts - sphereVerts;


    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    let vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    for (let i = 0; i < numFigureNodes; i++) {
        figure[i] = createNode(null, null, null, null);
        initFigureNodes(i);
    }

    for (let i = 0; i < numSceneNodes; i++) {
        scene[i] = createNode(null, null, null, null);
        initSceneNodes(i);
    }

    colorLoc = gl.getUniformLocation(program, "fColor");

    canvas.addEventListener("mousedown", function (event) {
        let x = 2 * event.clientX / canvas.width - 1;
        let y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        startMotion(x, y);
    });

    canvas.addEventListener("mouseup", function (event) {
        let x = 2 * event.clientX / canvas.width - 1;
        let y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        stopMotion(x, y);
    });

    canvas.addEventListener("mousemove", function (event) {

        let x = 2 * event.clientX / canvas.width - 1;
        let y = 2 * (canvas.height - event.clientY) / canvas.height - 1;
        mouseMotion(x, y);
    });

    document.addEventListener("keydown",
        function (event) {
            let keyCode = 0;
            if (event.key != null && event.key.length > 0) {
                switch (event.key) {
                    case "ArrowLeft": keyCode = 37; break;
                    case "ArrowUp": keyCode = 38; break;
                    case "ArrowRight": keyCode = 39; break;
                    case "ArrowDown": keyCode = 40; break;
                    case "PageUp": keyCode = 33; break;
                    case "PageDown": keyCode = 34; break;
                    default:
                        keyCode = (event.key.length > 1) ? 0 :
                            event.key.toUpperCase().charCodeAt(0);
                }
            } else if (event.keyCode !== undefined) {
                keyCode = event.keyCode;
            }

            if (keyCode == 65 || keyCode == 37) {   // A or Left
                figureTheta[torsoId] -= 5;
                initFigureNodes(torsoId);
            }

            if (keyCode == 68 || keyCode == 39) {   // D or Right
                figureTheta[torsoId] += 5;
                initFigureNodes(torsoId);
            }

            if (keyCode == 87 || keyCode == 38) {   // W or Up
                walkForward();
            }

            if (keyCode == 83 || keyCode == 40) {   // S or Down
                runForward();
            }

            if (keyCode == 33) {   // Page Up
                if (eyeRadius < 200) {
                    ++eyeRadius;
                }
            }

            if (keyCode == 34) {   // Page Down
                if (eyeRadius > 20) {
                    --eyeRadius;
                }
            }
        }, false);

    document.addEventListener("wheel",
        function (event) {
            let delta = Math.sign(event.deltaY);
            if (eyeRadius < 200 && delta > 0) {
                eyeRadius += 2;
            }
            else if (eyeRadius > 20 && delta < 0) {
                eyeRadius -= 2;
            }
        });

    cubeFrontImage = document.getElementById("cubefront");
    cubeBackImage = document.getElementById("cubeback");
    cubeTopImage = document.getElementById("cubetop");
    cubeBottomImage = document.getElementById("cubebottom");
    cubeLeftImage = document.getElementById("cubeleft");
    cubeRightImage = document.getElementById("cuberight");

    configureCubeMap(cubeFrontImage, cubeBackImage, cubeTopImage,
        cubeBottomImage, cubeRightImage, cubeLeftImage);

    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(gl.getUniformLocation(program, "texMap"), 0);

    showSkyLoc = gl.getUniformLocation(program, "showSky");

    render();
}

function configureCubeMap(frontImg, backImg, topImg, bottomImg, rightImg, leftImg) {
    cubeMap = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);

    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, rightImg);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, leftImg);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, topImg);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, bottomImg);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, frontImg);
    gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA,
        gl.RGBA, gl.UNSIGNED_BYTE, backImg);

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
}

function mouseMotion(x, y) {
    if (trackingMouse) {
        xAngle += (x - curx);
        curx = x;
        yAngle += (cury - y);
        cury = y;
    }
}

function startMotion(x, y) {
    trackingMouse = true;
    curx = x;
    cury = y;
}

function stopMotion(x, y) {
    trackingMouse = false;
}

function runArmMove() {
    if (armStack.length == 0) {
        armBackForth(rightLowerArmId, 15, 5, 12, 2);
        armBackForth(leftLowerArmId, 15, -5, 12, 2);
        armBackForth(rightUpperArmId, 15, 5, 12, 2);
        armBackForth(leftUpperArmId, 15, -5, 12, 2);
    }
}

function runLegMove() {
    if (legStack.length == 0) {
        legBackForthV1(rightLowerLegId, 15, 4, 12, 2);
        legBackForthV1(leftLowerLegId, 15, 4, 12, 2);
        legBackForthV2(rightUpperLegId, 15, -6, -4, 12, 2);
        legBackForthV2(leftUpperLegId, 15, 4, 6, 12, 2);
    }
}

function walkArmMove() {
    if (armStack.length == 0) {
        armBackForth(rightLowerArmId, 8, 2, 30, 2);
        armBackForth(leftLowerArmId, 8, -2, 30, 2);
        armBackForth(rightUpperArmId, 8, 2, 30, 2);
        armBackForth(leftUpperArmId, 8, -2, 30, 2);
    }
}

function walkLegMove() {
    if (legStack.length == 0) {
        legBackForthV1(rightLowerLegId, 8, 1, 30, 2);
        legBackForthV1(leftLowerLegId, 8, 1, 30, 2);
        legBackForthV2(rightUpperLegId, 8, -3, -2, 30, 2);
        legBackForthV2(leftUpperLegId, 8, 2, 3, 30, 2);
    }
}

function armBackForth(id, reps, angoff, delay, parts) {
    armStack.push(true);
    armForth(id, reps, reps, angoff, delay, parts);
}

function armForth(id, start, curr, off, delay, parts) {
    figureTheta[id] += off;
    initFigureNodes(id);

    --curr;
    setTimeout(function () {
        if (curr > 0) {
            armForth(id, start, curr, off, delay, parts);
        }
        if (curr == 0) {
            armBack(id, start, start, off, delay, parts);
        }
    }, delay);
}

function armBack(id, start, curr, off, delay, parts) {
    figureTheta[id] -= off;
    initFigureNodes(id);

    --curr;
    if (curr > 0) {
        setTimeout(function () {
            armBack(id, start, curr, off, delay, parts);
        }, delay);
    }
    else {
        --parts;
        if (parts > 0) {
            armForth(id, start, start, -off, delay, parts);
        }
        else {
            armStack.pop();
        }
    }
}

function legBackForthV1(id, reps, angoff, delay, parts) {
    legStack.push(true);
    legForthV1(id, reps, reps, angoff, delay, parts);
}

function legForthV1(id, start, curr, off, delay, parts) {
    figureTheta[id] += off;
    initFigureNodes(id);

    --curr;
    setTimeout(function () {
        if (curr > 0) {
            legForthV1(id, start, curr, off, delay, parts);
        }
        if (curr == 0) {
            legBackV1(id, start, start, off, delay, parts);
        }
    }, delay);
}

function legBackV1(id, start, curr, off, delay, parts) {
    figureTheta[id] -= off;
    initFigureNodes(id);

    --curr;
    if (curr > 0) {
        setTimeout(function () {
            legBackV1(id, start, curr, off, delay, parts);
        }, delay);
    }
    else {
        --parts;
        if (parts > 0) {
            legForthV1(id, start, start, off, delay, parts);
        }
        else {
            legStack.pop();
        }
    }
}
function legBackForthV2(id, reps, angoff1, angoff2, delay, parts) {
    legStack.push(true);
    legForthV2(id, reps, reps, angoff1, angoff2, delay, parts);
}

function legForthV2(id, start, curr, off, off2, delay, parts) {
    figureTheta[id] += off;
    initFigureNodes(id);

    --curr;
    setTimeout(function () {
        if (curr > 0) {
            legForthV2(id, start, curr, off, off2, delay, parts);
        }
        if (curr == 0) {
            legBackV2(id, start, start, off, off2, delay, parts);
        }
    }, delay);
}

function legBackV2(id, start, curr, off, off2, delay, parts) {
    figureTheta[id] -= off;
    initFigureNodes(id);

    --curr;
    if (curr > 0) {
        setTimeout(function () {
            legBackV2(id, start, curr, off, off2, delay, parts);
        }, delay);
    }
    else {
        --parts;
        if (parts > 0) {
            legForthV2(id, start, start, -off2, -off, delay, parts);
        }
        else {
            legStack.pop();
        }
    }
}

function offsetFigurePos(unit) {//added above here in the instruction in the vid it was below
    let initX = figurePos[0];
    let initZ = figurePos[2];

    fTheta = Math.PI * figureTheta[torsoId] / 180;
    figurePos[0] += Math.sin(fTheta) * unit;
    figurePos[2] += Math.cos(fTheta) * unit;
    for (let i = 1; i <= 4; ++i) {
        if (!collision()) {
            break;
        } else if (i == 4) {
            figurePos[0] = initX;
            figurePos[2] = initZ;
        } else { // attempts made at different distances
            figurePos[0] = initX + Math.sin(fTheta) * unit * (4 - i) / 4;
            figurePos[2] = initZ + Math.cos(fTheta) * unit * (4 - i) / 4;
        }
    }

    checkEdge();

    initFigureNodes(torsoId);
}

function collision() {
    for (let i = 0; i < colPosArray.length; ++i) {
        if (colPosArray[i] != null) {
            if (circleRectCollide(colPosArray[i][0],
                colPosArray[i][2], columnDiameter / 2,
                figurePos[0] - torsoWidth,
                figurePos[2] - torsoWidth,
                figurePos[0] + torsoWidth,
                figurePos[2] + torsoWidth)) {
                return true;
            }
        }
    }
    return false;
}

function circleRectCollide(circX, circY, circRad,
    rectLeft, rectTop, rectRight, rectBottom) {
    // Find the closest point to the circle within the rectangle
    let closestX = Math.min(rectRight, Math.max(rectLeft, circX));
    let closestY = Math.min(rectBottom, Math.max(rectTop, circY));

    // Find the distance between circle's center and closest point
    let distanceX = circX - closestX;
    let distanceY = circY - closestY;

    // If less than the circle's radius, an collision has occured
    let distanceSquared = (distanceX * distanceX) +
        (distanceY * distanceY);
    return distanceSquared < (circRad * circRad);
}

function checkEdge() {
    if (figurePos[0] < xMin) {
        figurePos[0] = xMin;
    }
    else if (figurePos[0] > xMax) {
        figurePos[0] = xMax;
    }
    if (figurePos[2] < zMin) {
        figurePos[2] = zMin;
    }
    else if (figurePos[2] > zMax) {
        figurePos[2] = zMax;
    }
}

function walkForward() {
    offsetFigurePos(walkDistance);
    walkArmMove();
    walkLegMove();
}

function runForward() {
    offsetFigurePos(runDistance);
    runArmMove();
    runLegMove();
}

function createNode(transform, render, sibling, child, color1, color2, texIndex1, texIndex2) {
    let node = {
        transform: transform,
        render: render,
        sibling: sibling,
        child: child,
        color1: color1,
        color2: color2,
        texIndex1: texIndex1,
        texIndex2: texIndex2
    }
    return node;
}


function initFigureNodes(Id) {
    let m;

    switch (Id) {

        case torsoId:
            m = translate(figurePos);
            m = mult(m, rotate(figureTheta[torsoId], 0, 1, 0));

            figure[torsoId] = createNode(m, torso, null, headId);
            break;

        case headId:
        case head1Id:
        case head2Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[headId] = createNode(m, head, leftUpperArmId, eye1Id);
            break;

        case eye1Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[eye1Id] = createNode(m, lefteye, eye2Id, null);
            break;

        case eye2Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[eye2Id] = createNode(m, righteye, mouthId, null);
            break;

        case mouthId:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[mouthId] = createNode(m, mouth, null, null);
            break;

        case eye1Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[eye1Id] = createNode(m, lefteye, eye2Id, null);
            break;

        case eye2Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[eye2Id] = createNode(m, righteye, mouthId, null);
            break;

        case mouthId:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[mouthId] = createNode(m, mouth, null, null);
            break;

        case eye1Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[eye1Id] = createNode(m, lefteye, eye2Id, null);
            break;

        case eye2Id:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[eye2Id] = createNode(m, righteye, mouthId, null);
            break;

        case mouthId:
            m = translate(0.0, torsoHeight + 0.5 * headHeight, 0.0);
            m = mult(m, rotate(figureTheta[head1Id], 1, 0, 0))
            m = mult(m, rotate(figureTheta[head2Id], 0, 1, 0));
            m = mult(m, translate(0.0, -0.5 * headHeight, 0.0));
            figure[mouthId] = createNode(m, mouth, null, null);
            break;

        case leftUpperArmId:
            m = translate(-(torsoWidth * 0.75), 0.9 * torsoHeight, 0.0);
            m = mult(m, rotate(figureTheta[leftUpperArmId], 1, 0, 0));
            figure[leftUpperArmId] = createNode(m, leftUpperArm, rightUpperArmId, leftLowerArmId);
            break;

        case rightUpperArmId:
            m = translate(torsoWidth * 0.75, 0.9 * torsoHeight, 0.0);
            m = mult(m, rotate(figureTheta[rightUpperArmId], 1, 0, 0));
            figure[rightUpperArmId] = createNode(m, rightUpperArm, leftUpperLegId, rightLowerArmId);
            break;

        case leftUpperLegId:
            m = translate(-(torsoWidth * 0.75), 0.1 * upperLegHeight, 0.0);
            m = mult(m, rotate(figureTheta[leftUpperLegId], 1, 0, 0));
            figure[leftUpperLegId] = createNode(m, leftUpperLeg, rightUpperLegId, leftLowerLegId);
            break;

        case rightUpperLegId:
            m = translate(torsoWidth * 0.75, 0.1 * upperLegHeight, 0.0);
            m = mult(m, rotate(figureTheta[rightUpperLegId], 1, 0, 0));
            figure[rightUpperLegId] = createNode(m, rightUpperLeg, null, rightLowerLegId);
            break;

        case leftLowerArmId:
            m = translate(0.0, upperArmHeight, 0.0);
            m = mult(m, rotate(figureTheta[leftLowerArmId], 1, 0, 0));
            figure[leftLowerArmId] = createNode(m, leftLowerArm, null, null);
            break;

        case rightLowerArmId:
            m = translate(0.0, upperArmHeight, 0.0);
            m = mult(m, rotate(figureTheta[rightLowerArmId], 1, 0, 0));
            figure[rightLowerArmId] = createNode(m, rightLowerArm, null, null);
            break;

        case leftLowerLegId:
            m = translate(0.0, upperLegHeight, 0.0);
            m = mult(m, rotate(figureTheta[leftLowerLegId], 1, 0, 0));
            figure[leftLowerLegId] = createNode(m, leftLowerLeg, null, null);
            break;

        case rightLowerLegId:
            m = translate(0.0, upperLegHeight, 0.0);
            m = mult(m, rotate(figureTheta[rightLowerLegId], 1, 0, 0));
            figure[rightLowerLegId] = createNode(m, rightLowerLeg, null, null);
            break;
    }
}
function initSceneNodes(Id) {
    let m;

    switch (Id) {

        case groundId:
            m = mat4();
            scene[groundId] = createNode(m, ground, columnId1, null);
            break;

        case columnId1:
            m = translate(colPosArray[columnId1]);
            scene[columnId1] = createNode(m, column, columnId2, null);
            break;

        case columnId2:
            m = translate(colPosArray[columnId2]);
            scene[columnId2] = createNode(m, column, columnId3, null);
            break;

        case columnId3:
            m = translate(colPosArray[columnId3]);
            scene[columnId3] = createNode(m, column, columnId4, null);
            break;

        case columnId4:
            m = translate(colPosArray[columnId4]);
            scene[columnId4] = createNode(m, column, columnId5, null);
            break;

        case columnId5:
            m = translate(colPosArray[columnId5]);
            scene[columnId5] = createNode(m, column, columnId6, null);
            break;

        case columnId6:
            m = translate(colPosArray[columnId6]);
            scene[columnId6] = createNode(m, column, columnId7, null);
            break;

        case columnId7:
            m = translate(colPosArray[columnId7]);
            scene[columnId7] = createNode(m, column, columnId8, null);
            break;

        case columnId8:
            m = translate(colPosArray[columnId8]);
            scene[columnId8] = createNode(m, column, columnId9, null);
            break;

        case columnId9:
            m = translate(colPosArray[columnId9]);
            scene[columnId9] = createNode(m, column, columnId10, null);
            break;

        case columnId10:
            m = translate(colPosArray[columnId10]);
            scene[columnId10] = createNode(m, column, null, null);
            break;
    }
}


function traverseFigure(Id) {
    if (Id == null) return;
    mvStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
    figure[Id].render();
    if (figure[Id].child != null) traverseFigure(figure[Id].child);
    modelViewMatrix = mvStack.pop();
    if (figure[Id].sibling != null) traverseFigure(figure[Id].sibling);
}

function traverseScene(Id) {
    if (Id == null) return;
    mvStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, scene[Id].transform);
    scene[Id].render();
    if (scene[Id].child != null)
        traverseScene(scene[Id].child);
    modelViewMatrix = mvStack.pop();
    if (scene[Id].sibling != null)
        traverseScene(scene[Id].sibling);
}

function torso() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * torsoHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, red);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function head() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(headWidth, headHeight, headWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, yellow);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function leftUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, lightgreen);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function leftLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, darkgreen);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function rightUpperArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(upperArmWidth, upperArmHeight, upperArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, lightgreen);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function rightLowerArm() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerArmHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(lowerArmWidth, lowerArmHeight, lowerArmWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, darkgreen);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function leftUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, lightblue);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function leftLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(lowerLegWidth, lowerLegHeight, lowerLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, darkblue);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function rightUpperLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * upperLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(upperLegWidth, upperLegHeight, upperLegWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, lightblue);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function rightLowerLeg() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * lowerLegHeight, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(lowerLegWidth, lowerLegHeight, lowerLegWidth))
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, darkblue);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function lefteye() {
    instanceMatrix = mult(modelViewMatrix, translate(-0.2, -4.0, 0.5));
    instanceMatrix = mult(instanceMatrix, scalem(eyeWidth, eyeWidth, eyeDepth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, black);
    gl.drawArrays(gl.TRIANGLES, cubeVerts, sphereVerts);
}

function righteye() {
    instanceMatrix = mult(modelViewMatrix, translate(0.2, -4.0, 0.5));
    instanceMatrix = mult(instanceMatrix, scalem(eyeWidth, eyeWidth, eyeDepth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, black);
    gl.drawArrays(gl.TRIANGLES, cubeVerts, sphereVerts);
}

function mouth() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, -4.5, 0.5));
    instanceMatrix = mult(instanceMatrix, scalem(mouthWidth, mouthHeight, mouthDepth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    gl.uniform4fv(colorLoc, black);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}

function ground() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, groundFloor, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(groundWidth, groundHeight, groundWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    gl.uniform4fv(colorLoc, darkcyan);
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
}


function column() {
    instanceMatrix = mult(modelViewMatrix, translate(0.0, groundFloor + columnHeight / 2, 0.0));
    instanceMatrix = mult(instanceMatrix, scalem(columnDiameter, columnHeight, columnDiameter));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));

    gl.uniform4fv(colorLoc, brown);
    gl.drawArrays(gl.TRIANGLES, cubeVerts + sphereVerts, cylinderVerts - cylinderEdgeVerts);

    gl.uniform4fv(colorLoc, black);
    gl.drawArrays(gl.TRIANGLES, cubeVerts + sphereVerts + cylinderVerts - cylinderEdgeVerts, cylinderEdgeVerts);
}

function makeCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(5, 1, 2, 6);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[b]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[a]);
    pointsArray.push(vertices[c]);
    pointsArray.push(vertices[d]);
}

function makeSphere() {
    let phi1, phi2, sinPhi1, sinPhi2, cosPhi1, cosPhi2;
    let theta1, theta2, sinTheta1, sinTheta2, cosTheta1, cosTheta2;
    let p1, p2, p3, p4;
    let latitudeBands = 30;
    let longitudeBands = 30;

    // For each latitudinal band determine phi's value
    for (let latNumber = 1; latNumber <= latitudeBands; latNumber++) {
        phi1 = Math.PI * (latNumber - 1) / latitudeBands;
        sinPhi1 = Math.sin(phi1);
        cosPhi1 = Math.cos(phi1);

        phi2 = Math.PI * latNumber / latitudeBands;
        sinPhi2 = Math.sin(phi2);
        cosPhi2 = Math.cos(phi2);

        // For each longitudinal band determine theta's value and other calculations
        for (let longNumber = 1; longNumber <= longitudeBands; longNumber++) {
            theta1 = 2 * Math.PI * (longNumber - 1) / longitudeBands;
            sinTheta1 = Math.sin(theta1);
            cosTheta1 = Math.cos(theta1);

            theta2 = 2 * Math.PI * longNumber / longitudeBands;
            sinTheta2 = Math.sin(theta2);
            cosTheta2 = Math.cos(theta2);

            p1 = vec4(cosTheta1 * sinPhi1, cosPhi1, sinTheta1 * sinPhi1, 1.0);
            p2 = vec4(cosTheta2 * sinPhi1, cosPhi1, sinTheta2 * sinPhi1, 1.0);
            p3 = vec4(cosTheta1 * sinPhi2, cosPhi2, sinTheta1 * sinPhi2, 1.0);
            p4 = vec4(cosTheta2 * sinPhi2, cosPhi2, sinTheta2 * sinPhi2, 1.0);

            pointsArray.push(p1);
            pointsArray.push(p2);
            pointsArray.push(p3);
            pointsArray.push(p2);
            pointsArray.push(p4);
            pointsArray.push(p3);
        }
    }
}

function makeCylinder(isClosed) {
    let x1, x2, y1, y2, xoff;
    let theta1, theta2, sinTheta1, sinTheta2, cosTheta1, cosTheta2;
    let p1, p2, p3, p4;
    let radialSlices = 30;
    let verticalSlices = 30;
    let vertNumber;

    // For each vertical slice get the y values
    for (vertNumber = 1; vertNumber <= verticalSlices; vertNumber++) {
        y1 = ((vertNumber - 1) * (1 / verticalSlices) - 0.5);
        y2 = (vertNumber * (1 / verticalSlices) - 0.5);

        // For each radial slice determine theta's value and other calculations
        for (let radNumber = 1; radNumber <= radialSlices; radNumber++) {
            theta1 = 2 * Math.PI * (radNumber - 1) / radialSlices;
            sinTheta1 = Math.sin(theta1);
            cosTheta1 = Math.cos(theta1);

            theta2 = 2 * Math.PI * radNumber / radialSlices;
            sinTheta2 = Math.sin(theta2);
            cosTheta2 = Math.cos(theta2);

            p1 = vec4(cosTheta1 * 0.5, y1, sinTheta1 * 0.5, 1.0);
            p2 = vec4(cosTheta2 * 0.5, y1, sinTheta2 * 0.5, 1.0);
            p3 = vec4(cosTheta1 * 0.5, y2, sinTheta1 * 0.5, 1.0);
            p4 = vec4(cosTheta2 * 0.5, y2, sinTheta2 * 0.5, 1.0);

            pointsArray.push(p1);
            pointsArray.push(p2);
            pointsArray.push(p3);
            pointsArray.push(p2);
            pointsArray.push(p4);
            pointsArray.push(p3);
        }
    }
    if (isClosed) {
        let count = pointsArray.length;
        for (let radNumber = 1; radNumber <= radialSlices; radNumber++) {
            theta1 = 2 * Math.PI * (radNumber - 1) / radialSlices;
            sinTheta1 = Math.sin(theta1);
            cosTheta1 = Math.cos(theta1);

            theta2 = 2 * Math.PI * radNumber / radialSlices;
            sinTheta2 = Math.sin(theta2);
            cosTheta2 = Math.cos(theta2);

            p1 = vec4(0, -0.5, 0);
            p2 = vec4(cosTheta1 * 0.5, -0.5, sinTheta1 * 0.5, 1.0);
            p3 = vec4(cosTheta2 * 0.5, -0.5, sinTheta2 * 0.5, 1.0);

            pointsArray.push(p1);
            pointsArray.push(p2);
            pointsArray.push(p3);

            p1 = vec4(0, 0.5, 0);
            p2 = vec4(cosTheta1 * 0.5, 0.5, sinTheta1 * 0.5, 1.0);
            p3 = vec4(cosTheta2 * 0.5, 0.5, sinTheta2 * 0.5, 1.0);

            pointsArray.push(p1);
            pointsArray.push(p2);
            pointsArray.push(p3);
        }
        cylinderEdgeVerts = pointsArray.length - count;
    }
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (yAngle < 0)
        yAngle += 2 * Math.PI;
    if (yAngle > 2 * Math.PI)
        yAngle -= 2 * Math.PI;
    if (xAngle < 0)
        xAngle += 2 * Math.PI;
    if (xAngle > 2 * Math.PI)
        xAngle -= 2 * Math.PI;

    if (yAngle > Math.PI / 2 && yAngle < 3 * Math.PI / 2) {
        up = vec3(0.0, -1.0, 0.0);
    }
    else {
        up = vec3(0.0, 1.0, 0.0);
    }

    let eye = vec3(figurePos[0] + eyeRadius * Math.cos(xAngle) * Math.cos(yAngle),
        figurePos[1] + eyeRadius * Math.sin(yAngle),
        figurePos[2] + eyeRadius * Math.sin(xAngle) * Math.cos(yAngle));

    at = vec3(figurePos);

    modelViewMatrix = lookAt(eye, at, up);

    // This draws the SkyBox
    mvStack.push(modelViewMatrix);
    gl.uniform1i(showSkyLoc, true);
    modelViewMatrix = mult(modelViewMatrix, scalem(skyboxScale, skyboxScale, skyboxScale));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, cubeVerts);
    gl.uniform1i(showSkyLoc, false);
    modelViewMatrix = mvStack.pop();

    traverseScene(groundId);

    traverseFigure(torsoId);

    requestAnimFrame(render);
}