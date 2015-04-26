function applyFilter(filterType) {

    //Todo    

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
        //         console.log(gFilter[i]);
    }

    return gFilter;
}