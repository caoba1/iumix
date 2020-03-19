window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();

  function loadSound() {
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:8000/music", true);
  request.responseType = "arraybuffer";

  request.onload = function() {
      var Data = request.response;
      process(Data);
  };

  request.send();
 }

 function process(Data) {
   source = context.createBufferSource(); // Create Sound Source
   context.decodeAudioData(Data, function(buffer){
     source.buffer = buffer;
     source.connect(context.destination);
     source.start(context.currentTime);
 }) 
