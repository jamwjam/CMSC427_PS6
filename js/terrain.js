$.ready(main());

var width, height;
var renderer, scene, camera, controls;
var plane, cube, cubes, group;
var stats, axes;
var x, y, row, col;
var TOTAL_CUBES, GRID;
var CUBE_SIZE, wall_size, halfwall_size;
var projector, mouse;
var raycaster;

var object;
var objects;
var INTERSECTED, SELECTED;

function main() {
    setUpGUI();
    setUpStats(document.body);
    init();
    animate();
}

function init() {
    width = window.innerWidth;
    height = window.innerHeight;

    objects = [];

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    scene = new THREE.Scene();
    
    //    camera = new THREE.PerspectiveCamera(45, width / height, .1, 10000);
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(0, 0, 0);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    group = new THREE.Object3D();
    raycaster = new THREE.Raycaster();
    projector = new THREE.Projector();
    mouse = new THREE.Vector2();


    axes = new THREE.AxisHelper(50);
    scene.add(axes);

    CUBE_SIZE = 2;
    GRID = 16;
    TOTAL_CUBES = (GRID * GRID);

    setUpCubes(group);
    scene.add(group);
    //    setUpCamera(0, 40, 40);
    setUpLights(scene);
    setUpRenderer(document.body);

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);


    window.addEventListener('resize', onWindowResize, false);
}

function update() {

}

function animate() {
    stats.begin();
    update();
    controls.update();

    renderScene();
    stats.end();
    requestAnimationFrame(animate);
}

function renderScene() {
    renderer.render(scene, camera);
    camera.updateMatrixWorld();
}

function de2ra(de) {
    return (de * Math.PI) / 180;
}


function setUpCubes(parent) {
    var cube;
    var geom = new THREE.CubeGeometry(CUBE_SIZE * 0.9, CUBE_SIZE * 0.9, CUBE_SIZE * 0.9);
    //var mat = new THREE.MeshBasicMaterial();
    var mat = new THREE.MeshLambertMaterial({
        color: 0xFF0000
    });
    x = y = row = col = 0;

    for (var i = 0; i < TOTAL_CUBES; i++) {

        cube = new THREE.Mesh(geom, mat);

        if ((i % GRID) === 0) {
            col = 1;
            row++;
        } else {
            col++;
        }

        x = -(((GRID * CUBE_SIZE) / 2) - ((CUBE_SIZE) * col) + (CUBE_SIZE / 2));
        y = (((GRID * CUBE_SIZE) / 2) - ((CUBE_SIZE) * row) + (CUBE_SIZE / 2));
        cube.position.set(x, 0, y);

        parent.add(cube);
    }
}

function setUpRenderer(parent) {
    renderer.setSize(width, height);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    parent.appendChild(renderer.domElement);
}

function setUpLights(parent) {
    var light, spotLight, ambientLight;

    //    spotLight = new THREE.SpotLight(0xffffff);
    //    spotLight.position.set(0, 100, 0);
    //    spotLight.castShadow = true;
    //    spotLight.shadowMapWidth = 2048;
    //    spotLight.shadowMapHeight = 2048;
    //    spotLight.shadowCameraNear = 1;
    //    spotLight.shadowCameraFar = 4000;
    //    spotLight.shadowCameraFov = 45;

    // Create yellow light source and add it to the scene
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();

    //    ambientLight = new THREE.AmbientLight(0x101010);

    parent.add(light);
    //parent.add(spotLight);
    //parent.add(ambientLight);
}

function setUpGUI() {
    var ColorObject = function () {
        this.color = [0, 128, 255, 0.3];
    }
    var colorObject = new ColorObject();

    var gui = new dat.GUI();
    var options = {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0
    };
}

function setUpStats(parent) {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    stats.setMode(0);
    parent.appendChild(stats.domElement);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();


    renderer.setSize(window.innerWidth, window.innerHeight);

}

function onDocumentMouseMove() {

    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseDown() {
    //console.log(mouse);
    //console.log(camera.position);
    //console.log(camera.position);


    camera.updateMatrixWorld();

    // find intersections
    var intersects = raycaster.intersectObjects(group.children);
    console.log(intersects);
}