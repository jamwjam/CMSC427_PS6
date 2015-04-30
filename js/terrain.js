var camera, scene, renderer, light, rectangles = [];

var raycaster, INTERSECTED;
var mouse, controls, stats;
var container;

var MOUSEDOWN, MOUSEUP, MOUSEBTN;

var RECT_SIZE = 15,
    RECT_HEIGHT = 256,
    GRID_SIZE = 27;
var NUM_CUBES = GRID_SIZE * GRID_SIZE;

var SHADOW_MAP_WIDTH = 2048,
    SHADOW_MAP_HEIGHT = 1024;

var guiOption = function () {
    this.color0 = "#ffae23";
    this.viewMode = 'Orbit Mode';
    this.brushType = 'Gaussian';
    this.brushSize = 1.0;
    this.brushMagnitude = 30;
    this.blurMagnitude = 0.13;
    this.orbitViewRadius = 400;
    this.orbitViewTheta = 0;
    this.reset = function () {
        reset();
    };
    this.toggleShadow = function () {
        castShadow();
    };
    this.castShadow = true;
    this.singleColor = function () {
        setSingleColor();
    };
    this.randomColor = function () {
        setRandomColor();
    };
};

var options = new guiOption();

$.ready(main());

function main() {
    setUpGUI();
    setUpStats(document.body);
    init();
    animate();
}

function init() {
    MOUSEDOWN = false;
    MOUSEUP = true;

    container = document.getElementById("threejs");

    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFShadowMap;

    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 400;

    scene = new THREE.Scene();
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    rectangles = [];

    // LIGHTS
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    light = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 2, 1);
    light.position.set(0, 1500, 1000);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadowCameraNear = 1200;
    light.shadowCameraFar = 2500;
    light.shadowCameraFov = 50;
    light.shadowBias = 0.0001;
    light.shadowDarkness = 0.5;
    light.shadowMapWidth = SHADOW_MAP_WIDTH;
    light.shadowMapHeight = SHADOW_MAP_HEIGHT;

    scene.add(light);

    populateRectangles(scene);
    showCaseRectangles();

    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    render();
    stats.end();
}

function render() {

    // View Mode
    switch (options.viewMode) {
    case 'Orbital Control':
        controls.update();
        break;
    case 'Orbit Mode':

        options.orbitViewTheta += 0.1;
        if (options.orbitViewTheta >= 360) {
            options.orbitViewTheta = 0;
        }
        camera.position.x = options.orbitViewRadius * Math.sin(THREE.Math.degToRad(options.orbitViewTheta));
        camera.position.y = options.orbitViewRadius;
        camera.position.z = options.orbitViewRadius * Math.cos(THREE.Math.degToRad(options.orbitViewTheta));
        camera.lookAt(scene.position);
        camera.updateMatrixWorld();
        break;
    }

    // Brush Action
    if (MOUSEDOWN) {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length >= 1 && MOUSEBTN == 1) {
            INTERSECTED = intersects[0].object;
            applyBrush(3);
        }
    }
    renderer.render(scene, camera);
}

function populateRectangles(parent) {
    var x = 0;
    var z = 0;
    var row = 0;
    var col = 0;
    var rectangle;

    var geometry = new THREE.BoxGeometry(RECT_SIZE, RECT_HEIGHT, RECT_SIZE);

    for (var i = 0; i < NUM_CUBES; i++) {

        var material = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        });

        if ((i % GRID_SIZE) === 0) {
            col = 1;
            row++;
        } else {
            col++;
        }

        x = -(((GRID_SIZE * RECT_SIZE) / 2) - ((RECT_SIZE) * col) + (RECT_SIZE / 2));
        z = (((GRID_SIZE * RECT_SIZE) / 2) - ((RECT_SIZE) * row) + (RECT_SIZE / 2));

        rectangle = new THREE.Mesh(geometry, material);
        rectangle.position.set(x, -3000, z);
        rectangle.castShadow = options.castShadow;
        rectangle.receiveShadow = options.castShadow;
        rectangles.push(rectangle);

        parent.add(rectangle);
    }
}

function onDocumentKeyDown(event) {

    switch (event.which) {

    case 66:
        for (var i = 0; i < rectangles.length; i++) {
            TweenMax.to(rectangles[i].position, 1 + Math.random() * 1, {
                y: 100,
                ease: SteppedEase.config(12 + Math.ceil(Math.random() * 5)),
            });
        }
        break;
    case 67:
        for (var i = 0; i < rectangles.length; i++) {
            TweenMax.to(rectangles[i].position, 1 + Math.random() * 2, {
                y: 100,
                ease: Elastic.easeOut,
            });
        }
        break;
    case 80:
        break;
    case 86:
        var t1 = new TimelineLite();
        for (var i = 0; i < rectangles.length; i++) {
            t1.to(rectangles[i].position, .005, {
                y: 10,
                ease: Linear.easeNone,
            });
        }
        t1.play();
        break;
    case 88:
        TweenMax.to(rectangles[0].position, 1, {
            y: 10,
            ease: Elastic.easeOut,
        });
        //xrectangles[0].position.y += 20;
        break;
    }
}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseDown(event) {
    MOUSEUP = false;
    MOUSEDOWN = true;
    MOUSEBTN = event.which;
}

function onDocumentMouseUp(event) {
    MOUSEDOWN = false;
    MOUSEUP = true;
}

function applyBrush() {

    var x = INTERSECTED.position.x;
    var z = INTERSECTED.position.z;

    var col = (x + ((GRID_SIZE * RECT_SIZE) / 2) - (RECT_SIZE / 2)) / RECT_SIZE;
    var row = ((z - ((GRID_SIZE * RECT_SIZE) / 2) - (RECT_SIZE / 2)) / -RECT_SIZE) - 1;
    var index = row * GRID_SIZE + col;

    //console.log(col + ' ' + row + ' ' + index);
    var sigma = 1;
    var strength = 1 / 49;
    var width = 3;

    switch (options.brushType) {
    case 'Gaussian':
        gaussianBrush(options.brushSize, options.brushMagnitude, row, col);
        break;
    case 'Pinpoint':
        pinpointBrush(options.brushSize, options.brushMagnitude, row, col);
        break;
    case 'Blur':
        blurBrush(options.blurMagnitude, row, col);
        break;
    case 'Color':
        colorBrush(options.brushSize, options.color0, row, col);
        break;
    }
}

function gaussianBrush(sigma, magnitude, row, col) {
    var fWidth = Math.ceil(sigma * 3);
    var fSize = (fWidth * 2) + 1;
    var newRow = 0;
    var newCol = 0;
    var index, fIndex = 0;
    var gFilter;

    gFilter = createGaussianFilter(sigma, magnitude);

    for (var i = -fWidth; i <= fWidth; i++) {
        for (var j = -fWidth; j <= fWidth; j++) {
            newRow = row + i;
            newCol = col + j;

            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                index = (newRow * GRID_SIZE) + newCol;
                rectangles[index].position.y += gFilter[fIndex];
            }
            fIndex += 1;
        }
    }
}

function pinpointBrush(sigma, magnitude, row, col) {
    var fWidth = Math.ceil(sigma * 2);
    var fSize = (fWidth * 2) + 1;
    var newRow = 0;
    var newCol = 0;
    var index;
    var gFilter;

    if (sigma < 0.6) {
        index = (row * GRID_SIZE) + col;
        rectangles[index].position.y += magnitude;
    } else {
        for (var i = -fWidth; i <= fWidth; i++) {
            for (var j = -fWidth; j <= fWidth; j++) {
                newRow = row + i;
                newCol = col + j;

                if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                    index = (newRow * GRID_SIZE) + newCol;
                    rectangles[index].position.y += magnitude / 6;
                }
            }
        }
    }
}

function blurBrush(magnitude, row, col) {
    var fWidth = 1;
    var fSize = (fWidth * 2) + 1;

    var newRow = 0;
    var newCol = 0;
    var index = (row * GRID_SIZE) + col;
    var fIndex = 0;
    var gFilter;

    var neighbors;
    var sum = 0;

    for (var i = -fWidth; i <= fWidth; i++) {
        for (var j = -fWidth; j <= fWidth; j++) {

            newRow = row + i;
            newCol = col + j;

            if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                findex = (newRow * GRID_SIZE) + newCol;

                sum += (rectangles[findex].position.y + 255) * magnitude;
            }
        }
    }
    //console.log(sum);
    rectangles[index].position.y = sum - 255;
}


function colorBrush(sigma, color, row, col) {
    var c = parseHex(color);
    var fWidth = Math.ceil(sigma);
    var fSize = (fWidth * 2) + 1;
    var newRow = 0;
    var newCol = 0;
    var index;

    if (sigma < 1) {
        index = (row * GRID_SIZE) + col;
        rectangles[index].material.color.setHex(c);
    } else {
        for (var i = -fWidth; i <= fWidth; i++) {
            for (var j = -fWidth; j <= fWidth; j++) {
                newRow = row + i;
                newCol = col + j;

                if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                    index = (newRow * GRID_SIZE) + newCol;
                    rectangles[index].material.color.setHex(c);
                }

            }
        }
    }
}

function createGaussianFilter(sigma, magnitude) {
    var fWidth = Math.ceil(sigma * 3);
    var fSize = (fWidth * 2) + 1;
    var gFilter = [];
    var temp;
    var sum = 0;

    for (var x = -fWidth; x <= fWidth; x++) {
        for (var y = -fWidth; y <= fWidth; y++) {
            temp = Math.exp(-((x * x) + (y * y)) / (2 * (sigma * sigma))) / (2 * Math.PI * (sigma * sigma));
            sum += temp;
            gFilter.push(temp);
        }
    }

    for (var i = 0; i < gFilter.length; i++) {
        gFilter[i] = (gFilter[i] / sum) * magnitude;
    }

    return gFilter;
}

function castShadow() {
    if (options.castShadow) {
        options.castShadow = false;
    } else {
        options.castShadow = true;
    }
    for (var i = 0; i < rectangles.length; i++) {
        rectangles[i].castShadow = options.castShadow;
        rectangles[i].recieveShadow = options.castShadow;
    }
}

function setSingleColor() {
    var c = parseHex(options.color0);
    for (var i = 0; i < rectangles.length; i++) {
        rectangles[i].material.color.setHex(c);
    }
}

function setRandomColor() {
    for (var i = 0; i < rectangles.length; i++) {
        rectangles[i].material.color.setHex(Math.random() * 0xffffff);
    }
}

function showCaseRectangles() {
    for (var i = 0; i < rectangles.length; i++) {
        TweenMax.to(rectangles[i].position, 1 + Math.random() * 1.5, {
            y: -85,
            //ease: SteppedEase.config(12 + Math.ceil(Math.random() * 5)),
            //ease: Elastic.easeOut,
            ease: Power4.easeInOut,
        });
        TweenMax.to(rectangles[i].position, 1 + Math.random() * 1, {
            y: -155,
            delay: 3,
            ease: Elastic.easeOut,
        });
    }
}

function reset() {
    for (var i = 0; i < rectangles.length; i++) {
        TweenMax.to(rectangles[i].position, 1 + Math.random() * 1, {
            y: -155,
            ease: Elastic.easeOut,
        });
    }
}

function setUpGUI() {
    var gui = new dat.GUI();

    var f0 = gui.addFolder('View Mode');
    f0.add(options, 'viewMode', ['Orbital Control', 'Orbit Mode', 'Stationary Mode']);
    f0.add(options, 'orbitViewTheta', 0, 360).listen();
    f0.add(options, 'orbitViewRadius', 100, 500);

    var f1 = gui.addFolder('Brush');
    f1.add(options, 'brushType', ['Gaussian', 'Pinpoint', 'Blur', 'Color']);
    f1.add(options, 'brushSize', .5, 2).onChange(function (value) {
        brushSize = value;
    });
    f1.add(options, 'brushMagnitude', -40, 40).onChange(function (value) {
        brushMagnitude = value;
    });
    f1.add(options, 'blurMagnitude', .10, .15);

    var f2 = gui.addFolder('Lighting');
    f2.add(options, 'toggleShadow');

    var f3 = gui.addFolder('Color');
    f3.addColor(options, 'color0').name('Color');
    f3.add(options, 'singleColor');
    f3.add(options, 'randomColor');

    gui.add(options, 'reset').name('Reset');
}

function setUpStats(parent) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.setMode(0);
    parent.appendChild(stats.domElement);
}

function parseHex(hex) {
    return '0x' + hex.slice(1);
}