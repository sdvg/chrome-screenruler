var MAGNIFIER_ZOOM = 16;
var MAGNIFIER_RADIUS = 100;
var MAGNIFIER_OFFSET = 20;

function init () {
    ctx_image.drawImage(img, 0, 0);

    canvas_ruler.addEventListener('mousemove', function (evt) {
        ctx_ruler.clearRect(0, 0, canvas_ruler.width, canvas_ruler.height);

        var position = {x: evt.x, y: evt.y};

        drawMagnifier(position);
        drawCrosshairs(position);
    });

    document.addEventListener('keydown', function (evt) {
        if(evt.keyCode == 27) {
            exit();
        }
    });
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
    ctx_ruler.strokeStyle = '#000';
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
    canvas.style.position = 'fixed';
    canvas.style.zIndex = '999999999';
    canvas.style.top = '0';
    canvas.style.left = '0';
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