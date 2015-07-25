function capture(data) {
  var canvas = document.getElementById('frame');
  var ctx = canvas.getContext('2d');

  var prefix = "data:image/jpeg;base64,";
  var img = new Image();
  img.src = prefix+data;

  img.onload = function(){
    ctx.drawImage(img, 0, 0, 550, 309);
  };
}

function clear() {
  var canvas = document.getElementById('frame');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);
}
