var addCanvas = function () {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.zIndex = '999999999';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    return canvas;
};

var canvas_image = addCanvas();
var ctx_image = canvas_image.getContext('2d');

var canvas_ruler = addCanvas();
var ctx_ruler = canvas_ruler.getContext('2d');

var img = new Image();
img.onload = function () {
  ctx_image.drawImage(img, 0, 0);

  canvas_ruler.addEventListener('mousemove', function (evt) {
    canvas_ruler.width = canvas_ruler.width; //better performance than clearRect

      //clip:
      ctx_ruler.save();
      ctx_ruler.beginPath();
      ctx_ruler.arc(evt.x + 120, evt.y + 120, 100, 0, Math.PI * 2, true);
      ctx_ruler.strokeStyle = 'red';
      ctx_ruler.stroke();
      ctx_ruler.closePath();
      ctx_ruler.clip();

      //draw magnifier
      for(var x = 0; x < 20; x++) {
          for(var y = 0; y < 20; y++) {
              var pixel = ctx_image.getImageData(evt.x + x - 10, evt.y - 10 + y, 1, 1).data;

              ctx_ruler.fillStyle = 'rgba(' + pixel[0] + ', ' + pixel[2] + ', ' + pixel[2] + ')';
              ctx_ruler.fillRect(evt.x + 20 + x * 10, evt.y + 20 + y * 10, 10, 10);
          }
      }

      ctx_ruler.restore();
  });
};

img.src = window.screenRulerScreenshot;