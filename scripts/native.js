function capture(data) {
  var canvas = $('#frame')[0];
  var ctx = canvas.getContext('2d');

  var prefix = "data:image/jpeg;base64,";
  var img = new Image();
  img.src = prefix+data;

  img.onload = function(){
    ctx.drawImage(img, 0, 0, 320, 320);
  };
}
