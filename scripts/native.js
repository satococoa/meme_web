function capture(data) {
  var canvas = document.getElementById('image');
  var ctx = canvas.getContext('2d');

  var prefix = 'data:image/jpeg;base64,';
  var img = new Image();
  img.src = prefix+data;

  img.onload = function() {
    ctx.drawImage(img, 0, 0, 550, 309);
  };
}

function clearImage() {
  var canvas = document.getElementById('image');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);
}

function setFrame(frameId) {
  var canvas = document.getElementById('frame');
  var ctx = canvas.getContext('2d');

  var frame = new Image();
  frame.src = 'images/' + frameId + '.png';
  frame.onload = function() {
    ctx.drawImage(frame, 0, 0, 550, 309);
  };
}

function clearFrame() {
  var canvas = document.getElementById('frame');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);
}
