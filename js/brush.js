function applyBrush(filterType) {

    var x = INTERSECTED.position.x;
    var z = INTERSECTED.position.z;

    var col = (x + ((GRID_SIZE * RECT_SIZE) / 2) - (RECT_SIZE / 2)) / RECT_SIZE;
    var row = ((z - ((GRID_SIZE * RECT_SIZE) / 2) - (RECT_SIZE / 2)) / -RECT_SIZE) - 1;
    var index = row * GRID_SIZE + col;

    //console.log(col + ' ' + row + ' ' + index);
    var sigma = 1;
    var strength = 1 / 49;
    var width = 3;

    switch (filterType) {
    case 1:
        gaussianBrush(1, -20, row, col);
        break;
    case 3:
        gaussianBrush(1, 20, row, col);
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

function blurBrush(sigma, magnitude, row, col) {
    //Todo
}

function gaussianBlurBrush(sigma, magnitude, row, col) {
    //Todo
}