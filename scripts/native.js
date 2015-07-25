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

// 撮影
function takePicture() {
  shutter();
  generateImage().then(function(data){
    try {
      debug('shutter 押したよ！');
      data = data.split(',')[1]
      debug("app://" + data);
      location.href = "app://" + data;
    } catch (e) {
      debug(e);
      console.log(e);
    }
  });
}

function debug(msg) {
  var debug = $("#debug");
  debug.text(debug.text() + msg);
}

// フレーム操作

var frames = [
  'jins',
  'frame1',
  'frame2',
  'frame3',
  'frame4',
  'frame5',
  'frame6',
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
    currentFrameIndex = frames.length - 1;
  }
  var frame = frames[currentFrameIndex];
  clearFrame();
  setFrame(frame);
}


// 以下 private

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

function shutter() {
  var height = $(window).height();
  var width = $(window).width();

  var upper = $('<div/>').attr({
    id: 'upper',
    class: 'shutter'
  }).css({
    height: height,
    width: width,
    top: - height
  });
  var bottom = $('<div/>').attr({
    id: 'bottom',
    class: 'shutter'
  }).css({
    height: height,
    width: width,
    top: height
  });
  $('body').append(upper).append(bottom);

  var duration = 100;

  var centerY = height / 2;
  upper.animate({
    top: - height + centerY
  }, duration, function(){
    upper.animate({
      top: - height
    }, duration, function(){})
  });

  bottom.animate({
    top: - centerY
  }, duration, function(){
    bottom.animate({
      top: height
    }, duration, function(){})
  });
}

function generateImage() {
  var image = document.getElementById('image');
  var frame = document.getElementById('frame');
  var timestamp = document.getElementById('timestamp');

  var generated = document.getElementById('generated');
  var ctx = generated.getContext('2d');

  var datas = [
    image.toDataURL('image/png'),
    frame.toDataURL('image/png'),
    timestamp.toDataURL('image/png')
  ];

  return Promise.all(datas.map(function(str){
    return new Promise(function(resolve, reject){
      var image = new Image();
      image.src = str;
      image.onload = function() {
        ctx.drawImage(image, 0, 0, 550, 309);
        resolve();
      };
    });
  })).then(function(){
    return getGeneratedImage();
  });
}

function getGeneratedImage() {
  var generated = document.getElementById('generated');
  return generated.toDataURL('image/jpeg');
}
