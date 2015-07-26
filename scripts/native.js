// 初期化処理
var processing = true;
function init() {
  setFrame('jins');
}

var faces = [ ];
function face(data) {
  data = JSON.parse(data);
  // 座標系の計算
  faces = data.map(function(d){
    var width = 1280.0;
    var x = d[0] / width * 550.0;
    var y = d[1] / width * 550.0;
    var distance = d[2] / width * 550.0;
    return [x, y, distance];
  })
}

function capture(data) {
  if (!processing) { return; }

  var canvas = document.getElementById('image');
  var ctx = canvas.getContext('2d');

  var prefix = 'data:image/jpeg;base64,';
  var img = new Image();
  img.src = prefix+data;

  img.onload = function() {
    ctx.drawImage(img, 0, 0, 550, 309);
    addGlasses();
  };
}

// 撮影
function takePicture() {
  processing = false;
  shutter();
  generateImage().then(function(data){
    try {
      data = data.split(',')[1];
      location.href = "app://" + data;
      $('#generated').show();
      setTimeout(function(){
        $('#generated').hide();
        processing = true;
      }, 3000);
    } catch (e) {
      // debug(e);
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
// preload
frames.map(function(frameId){
  var frame = new Image();
  frame.src = 'images/' + frameId + '.png';
  frame.onload = function() {
    console.log("preload: " + frameId);
  }
});

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

// オーラ操作
function setAura(auraId) {
  var aura = document.getElementById('aura');
  var ctx = aura.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);
  if (auraId == 0) { return; }

  var image = new Image();
  image.src = 'images/aura' + auraId + '.png';
  image.onload = function() {
    ctx.globalAlpha = 1.0;
    // ctx.globalAlpha = 0.8;
    ctx.drawImage(image, 0, 0, 550, 309);
  };
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
    top: 0
  });
  $('body').append(upper);

  var duration = 50;
  upper.animate({
    opacity: .6
  }, duration, function(){
    upper.animate({
      opacity: 0
    }, duration, function(){
      $('upper').remove()
    });
  });
}

function generateImage() {
  var image = document.getElementById('image');
  var aura = document.getElementById('aura');
  var frame = document.getElementById('frame');
  var timestamp = document.getElementById('timestamp');

  var generated = document.getElementById('generated');
  var ctx = generated.getContext('2d');
  ctx.clearRect(0, 0, 550, 309);

  var datas = [
    image.toDataURL('image/png'),
    aura.toDataURL('image/png'),
    frame.toDataURL('image/png'),
    timestamp.toDataURL('image/png')
  ];

  return Promise.all(datas.map(function(str, i){
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

function addGlasses() {
  return new Promise(function(resolve, reject){
    var canvas = document.getElementById("image");
    var ctx = canvas.getContext('2d');

    var glasses = new Image();
    var faceWidth = 130;
    var faceHeight = 80;
    glasses.onload = function(){
      faces.forEach(function(d){
        ctx.drawImage(glasses, d[0]-(faceWidth/2), d[1]-faceHeight+(faceHeight/8), faceWidth, faceHeight);
      });
      resolve();
    };
    glasses.src = "images/glasses.png";
  });
}
