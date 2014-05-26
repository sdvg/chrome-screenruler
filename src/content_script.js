var MAGNIFIER_ZOOM = 16;
var MAGNIFIER_RADIUS = 100;
var MAGNIFIER_OFFSET = 20;

var measureStartPosition = null;

var canvasStyles = [
    'position: fixed',
    'width: 100%',
    'min-width: 100%',
    'max-width: 100%',
    'height: 100%',
    'min-height: 100%',
    'max-height: 100%',
    'z-index: 999999999',
    'top: 0',
    'right: 0',
    'bottom: 0',
    'left: 0',
    'cursor: none',
    'display: block',
    'visibility: visible',
    'margin: 0',
    '-webkit-transform: none',
    'transform: none',
    'opacity: 100',
    'border: 0',
    'clip: auto',
    'overflow: hidden',
    'zoom: 0',
    'border-radius: 0'
];

function init () {
    ctx_image.drawImage(img, 0, 0);

    canvas_ruler.addEventListener('mousemove', function (evt) {
        ctx_ruler.clearRect(0, 0, canvas_ruler.width, canvas_ruler.height);

        var position = {x: evt.x, y: evt.y};

        drawMagnifier(position);
        drawCrosshairs(position);
    });

    canvas_ruler.addEventListener('mousedown', function (evt) {
        measureStartPosition = {x: evt.x - 1, y: evt.y - 1};

        canvas_ruler.addEventListener('mousemove', measureMove);
        canvas_ruler.addEventListener('mouseup', measureEnd);
    });

    document.addEventListener('keydown', function (evt) {
        if(evt.keyCode == 27) {
            exit();
        }
    });
}

function measureMove (evt) {
    drawLine(measureStartPosition.x, measureStartPosition.y, evt.x, evt.y);
}

function measureEnd (evt) {
    canvas_ruler.removeEventListener('mousemove', measureMove);
    canvas_ruler.removeEventListener('mouseup', measureEnd);

    prompt('Size:', (evt.x - measureStartPosition.x) + ' x ' + (evt.y - measureStartPosition.y));
    exit();
}

function drawMagnifier (position) {
    ctx_ruler.save();
    ctx_ruler.beginPath();
    ctx_ruler.arc(position.x + MAGNIFIER_RADIUS + MAGNIFIER_OFFSET,
                  position.y + MAGNIFIER_RADIUS + MAGNIFIER_OFFSET,
                  MAGNIFIER_RADIUS, 0, Math.PI * 2, true);
    ctx_ruler.lineWidth = 8;
    ctx_ruler.stroke();
    ctx_ruler.closePath();
    ctx_ruler.clip();

    for(var x = 0; x < MAGNIFIER_RADIUS * 2 / MAGNIFIER_ZOOM; x++) {
        for(var y = 0; y < MAGNIFIER_RADIUS * 2 / MAGNIFIER_ZOOM; y++) {
            var pixel = ctx_image.getImageData(position.x + x - MAGNIFIER_RADIUS / MAGNIFIER_ZOOM,
                                               position.y - MAGNIFIER_RADIUS / MAGNIFIER_ZOOM + y, 1, 1).data;

            ctx_ruler.fillStyle = 'rgb(' + pixel[0] + ', ' + pixel[1] + ', ' + pixel[2] + ')';
            ctx_ruler.fillRect(position.x + MAGNIFIER_OFFSET + x * MAGNIFIER_ZOOM - MAGNIFIER_ZOOM / 2,
                               position.y + MAGNIFIER_OFFSET + y * MAGNIFIER_ZOOM - MAGNIFIER_ZOOM / 2,
                               MAGNIFIER_ZOOM, MAGNIFIER_ZOOM);
        }
    }

    //draw scope:
    var selectedPixel = ctx_image.getImageData(position.x - 1, position.y - 1, 1, 1).data;
    var brightness = (selectedPixel[0] + selectedPixel[1] + selectedPixel[3]) / 3;

    ctx_ruler.strokeStyle = brightness < 150 ? '#fff' : '#000';

    ctx_ruler.lineWidth = 2;
    ctx_ruler.strokeRect(position.x + MAGNIFIER_RADIUS + MAGNIFIER_OFFSET - 5 - MAGNIFIER_ZOOM / 2,
                         position.y + MAGNIFIER_RADIUS + MAGNIFIER_OFFSET - 5 - MAGNIFIER_ZOOM / 2,
                         MAGNIFIER_ZOOM + ctx_ruler.lineWidth,
                         MAGNIFIER_ZOOM + ctx_ruler.lineWidth);

    ctx_ruler.restore();
}

function drawCrosshairs (position) {
    drawLine(0, position.y - 0.5, canvas_ruler.width, position.y - 0.5); //horizontal
    drawLine(position.x - 0.5, 0, position.x - 0.5, canvas_ruler.height); //verical
}

function drawLine (fromX, fromY, toX, toY) {
    ctx_ruler.beginPath();
    ctx_ruler.moveTo(fromX, fromY);
    ctx_ruler.lineTo(toX, toY);
    ctx_ruler.closePath();
    ctx_ruler.stroke();
}

function addCanvas () {
    var canvas = document.createElement('canvas');
    canvas.setAttribute('style', canvasStyles.join(' !important; '));
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    return canvas;
}

function exit () {
    canvas_image.remove();
    canvas_ruler.remove();
}


var canvas_image = addCanvas();
var ctx_image = canvas_image.getContext('2d');

var canvas_ruler = addCanvas();
var ctx_ruler = canvas_ruler.getContext('2d');

var img = new Image();
img.onload = init;
img.src = window.screenRulerScreenshot;