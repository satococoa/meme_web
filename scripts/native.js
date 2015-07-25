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
  setTimestamp();
}

function setTimestamp() {
  var canvas = document.getElementById('timestamp');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);

  ctx.font = "16px 'Roboto'";
  ctx.fillStyle = "rgb(255, 78, 0)";
  ctx.textAlign =  "right";
  var margin = 10;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "rgba(0, 0, 0, .6)";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;
  ctx.fillText(timestamp(), 550 - margin, 309 - margin);
}

function clearFrame() {
  var canvas = document.getElementById('frame');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);
}

function timestamp() {
  // 2015.7.25
  var d = new Date();
  var year  = d.getFullYear();
  var month = d.getMonth() + 1;
  var date  = d.getDate();

  return year + '.' + month + '.' + date;
}

var frames = [
  'jins', 'frame1', 'gradation'
];
var currentFrameIndex = 0;

function nextFrame() {
  if (++currentFrameIndex >= frames.length) {
    currentFrameIndex = 0;
  }
  var frame = frames[currentFrameIndex];
  clearFrame();
  setFrame(frame);
}

function prevFrame() {
  if (--currentFrameIndex < 0) {
    currentFrameIndex = 2;
  }
  var frame = frames[currentFrameIndex];
  clearFrame();
  setFrame(frame);
}
