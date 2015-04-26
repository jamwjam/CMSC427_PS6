var camera, scene, renderer, axes;
var object;

var raycaster, SELECTED, INTERSECTED;
var mouse, objects;
var theta, radius;
var controls;

var MOUSEDOWN, MOUSEUP, MOUSEBTN;

var RECT_SIZE = 15;
var RECT_HEIGHT = 256;

var GRID_SIZE = 32;
var NUM_CUBES = GRID_SIZE * GRID_SIZE;

var filterType;

var rectangles = [];

var brushSize, brushMagnitude;

var stats;

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

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 400;

    filterType = 0;
    theta = 0;
    radius = 100;
    scene = new THREE.Scene();
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    objects = [];
    rectangles = [];

    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    populateRectangles(scene);

    brushSize = 0, brushMagnitude = 0;

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
    controls.update();
    render();
    stats.end();
}

function render() {
    if (MOUSEDOWN) {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length >= 1) {
            INTERSECTED = intersects[0].object;

            switch (MOUSEBTN) {
            case 1:
                applyBrush(3);
                break;
            case 3:
                applyBrush(1);
                break;
            }
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

        //        console.log(x + ' ' + z);
        rectangle.position.set(x, -255, z);

        rectangles.push(rectangle);

        parent.add(rectangle);
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

function setUpGUI() {
    var gui = new dat.GUI();
    var options = {
        viewMode: 'Orbital Control',
        brushType: 'Gaussian',
        brushSize: 0.5,
        brushMagnitude: 10
    };

    gui.add(options, 'viewMode', ['Orbital Control', 'Orbit Mode', 'WASD Mode']);

    var f1 = gui.addFolder('Brush');
    f1.add(options, 'brushType', ['Gaussian', 'Pinpoint']);
    f1.add(options, 'brushSize', .5, 2).onChange(function (value) {
        brushSize = value;
    });
    f1.add(options, 'brushMagnitude', -20, 20).onChange(function (value) {
        brushMagnitude = value;
    });
}

function setUpStats(parent) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.setMode(0);
    parent.appendChild(stats.domElement);
}