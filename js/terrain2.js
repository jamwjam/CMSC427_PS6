var camera, scene, renderer, axes;
var object;

var raycaster, SELECTED, INTERSECTED;
var mouse, objects;
var theta, radius;
var controls;

var MOUSEDOWN, MOUSEUP, MOUSEBTN;

var RECT_SIZE = 15;
var RECT_HEIGHT = 256;

var GRID_SIZE = 10;
var NUM_CUBES = GRID_SIZE * GRID_SIZE;

var filterType;

var rectangles = [];

$.ready(main());


function main() {
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
    controls.update();
    render();
}

function render() {
    if (MOUSEDOWN) {
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length >= 1) {
            INTERSECTED = intersects[0].object;

            switch (MOUSEBTN) {
            case 1:
                INTERSECTED.position.y += 1;
                break;
            case 2:
                applyFilter(1);
                break;
            case 3:
                INTERSECTED.position.y -= 1;
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

        console.log(x + ' ' + z);
        rectangle.position.set(x, -255, z);

        rectangles.push(rectangle);

        parent.add(rectangle);
    }
}

function applyFilter(filterType) {

    var x = INTERSECTED.position.x;
    var z = INTERSECTED.position.z;

    var col = (x + ((GRID_SIZE * RECT_SIZE) / 2) - (RECT_SIZE / 2)) / RECT_SIZE;
    var row = ((z - ((GRID_SIZE * RECT_SIZE) / 2) - (RECT_SIZE / 2)) / -RECT_SIZE) - 1;
    var index = row * GRID_SIZE + col;

    console.log(col + ' ' + row + ' ' + index);
    var sigma = 1;
    var strength = 1 / 49;
    var width = 3;

    switch (filterType) {
    case 1:
        applyBlurFilter(strength, width);
        break;
    case 2:
        applyGaussianFilter(sigma, width);
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

function applyBlurFilter(strength, width) {
    var newRow, newCol, sum, index;

    var sum = 0;

    for (var row = 0; row < GRID_SIZE; row++) {
        for (var col = 0; col < GRID_SIZE; col++) {

            index = row * GRID_SIZE + col;

            //row
            for (var i = -width; i <= width; i++) {
                //col
                for (var j = -width; j <= width; j++) {
                    newRow = row - i;
                    newCol = col - j;

                    if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
                        tempIndex = newRow * GRID_SIZE + newCol;

                        index = newRow * GRID_SIZE + newCol;
                        sum += rectangles[tempIndex].position.y * strength;
                    }

                }
            }
            console.log(sum);
            break;
        }
        break;
    }

    //    for (var i = 0; i < sumArray.length; i++) {
    //        console.log(sumArray[i]);
    //    }
}

function applyGaussianFilter(sigma, width) {

}