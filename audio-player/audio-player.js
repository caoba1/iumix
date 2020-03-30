function initProgressBar() {
  var player = document.getElementById('audioStreamA');
  var length = document.getElementById('durationA').innerHTML;//player.duration
  var current_time = player.currentTime;
  player.duration = length;
//console.log(length);
  // calculate total length of value
  var totalLength = calculateTotalValue(length)
  document.getElementById("end-time").innerHTML = totalLength;

  // calculate current value time
  var currentTime = calculateCurrentValue(current_time);
  document.getElementById("start-time").innerHTML = currentTime;

  var progressbar = document.getElementById('seek-obj');
  //console.log("<<<"+player.currentTime);
  //progressbar.value = (player.currentTime / player.duration);
  if (length !=0){
  progressbar.value = (player.currentTime / length);
} else {progressbar.value = 0;}
  //console.log("of "+player.duration+">>>");
  progressbar.addEventListener("click", seek);

  if (player.currentTime == player.duration) {
    // replay if loop
    document.getElementById('play-btn').className = "";
  }

  if (player.currentTime >= length * document.getElementById('sliderA').valueHigh | player.currentTime <= length * document.getElementById('sliderA').valueLow) {
    // replay if loop
    player.currentTime = length * document.getElementById('sliderA').valueLow;
    progressbar.value = document.getElementById('sliderA').valueLow;
  }

  // Show looper's values --- TODO: change placement of this function or add tooltips
  document.getElementById('sliderALowTip').innerHTML=calculateTotalValue(document.getElementById('sliderA').valueLow*length);
  document.getElementById('sliderAHighTip').innerHTML=calculateTotalValue(document.getElementById('sliderA').valueHigh*length);

  function seek(event) {
    var percent = event.offsetX / this.offsetWidth;
    player.currentTime = percent * length;//player.duration;
    progressbar.value = percent; /// 100;
  }
};

function initProgressBarB() {
  var playerB = document.getElementById('audioStreamB');
  var lengthB = document.getElementById('durationB').innerHTML;//player.duration
  var current_timeB = playerB.currentTime;
  playerB.duration = lengthB;
//console.log(length);
  // calculate total length of value
  var totalLength = calculateTotalValue(lengthB)
  document.getElementById("end-timeB").innerHTML = totalLength;

  // calculate current value time
  var currentTimeB = calculateCurrentValue(current_timeB);
  document.getElementById("start-timeB").innerHTML = currentTimeB;

  var progressbarB = document.getElementById('seek-objB');

  if (lengthB !=0){
  progressbarB.value = (playerB.currentTime  / lengthB);
} else {progressbarB.value = 0;}
  progressbarB.addEventListener("click", seek);

// change to length
  if (playerB.currentTime == playerB.duration) {
    document.getElementById('play-btnB').className = "";
  }

  if (playerB.currentTime >= lengthB * document.getElementById('sliderB').valueHigh | playerB.currentTime <= lengthB * document.getElementById('sliderB').valueLow) {
    // replay if loop
    playerB.currentTime = lengthB * document.getElementById('sliderB').valueLow;
    progressbarB.value = document.getElementById('sliderB').valueLow;
  }

  // Show looper's values --- TODO: change placement of this function or add tooltips
  document.getElementById('sliderBLowTip').innerHTML=calculateTotalValue(document.getElementById('sliderB').valueLow*lengthB);
  document.getElementById('sliderBHighTip').innerHTML=calculateTotalValue(document.getElementById('sliderB').valueHigh*lengthB);

  function seek(event) {
    var percent = event.offsetX / this.offsetWidth;
    playerB.currentTime = percent * lengthB;//player.duration;
    progressbarB.value = percent; /// 100;
  }
};


function initPlayers(num) {
  // pass num in if there are multiple audio players e.g 'player' + i
  for (var i = 0; i < num; i++) {
    (function() {
      if (i===0){
        var playerContainer = document.getElementById('player-container'),
          player = document.getElementById('audioStreamA'),
          isPlaying = false,
          playBtn = document.getElementById('play-btn');
                // Controls Listeners
                // ----------------------------------------------------------
                if (playBtn != null) {
                  playBtn.addEventListener('click', function() {
                    togglePlay()
                  });
                }

                // Controls & Sounds Methods
                // ----------------------------------------------------------
                function togglePlay() {
                  console.log("Player A toggled");
                  if (player.paused === false) {
                    player.pause();
                    isPlaying = false;
                    document.getElementById('play-btn').className = "";

                  } else {
                    player.play();
                    document.getElementById('play-btn').className = "pause";
                    isPlaying = true;
                  }
                }


      }else if (i===1){
        var playerContainer = document.getElementById('player-containerB'),
          playerB = document.getElementById('audioStreamB'),
          isPlayingB = false,
          playBtnB = document.getElementById('play-btnB');
                if (playBtnB != null) {
                  playBtnB.addEventListener('click', function() {
                    togglePlayB()
                  });
                }
            function togglePlayB() {
              console.log("Player B toggled");
                  if (playerB.paused === false) {
                    playerB.pause();
                    isPlayingB = false;
                    document.getElementById('play-btnB').className = "";

                  } else {
                    playerB.play();
                    document.getElementById('play-btnB').className = "pause";
                    isPlayingB = true;
                  }
                }
      }
    }());
  }
}

function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
    seconds_int = length - minutes * 60,
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = minutes + ':' + seconds

  return time;
}

function calculateCurrentValue(currentTime) {
  var current_hour = parseInt(currentTime / 3600) % 24,
    current_minute = parseInt(currentTime / 60) % 60,
    current_seconds_long = currentTime % 60,
    current_seconds = current_seconds_long.toFixed(),
    current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

  return current_time;
}

//Initialize!
initPlayers(2);
setVideoTitleData(idInA,document.getElementById('titleA'),document.getElementById('durationA'));
setVideoTitleData(idInB,document.getElementById('titleB'),document.getElementById('durationB'));
initProgressBar();
initProgressBarB();


/*function initPlayers(num) {
  // pass num in if there are multiple audio players e.g 'player' + i

  for (var i = 0; i < num; i++) {
    (function() {

      // Variables
      // ----------------------------------------------------------
      // audio embed object
      var playerContainer = document.getElementById('player-container'),
        player = document.getElementById('audioStreamA'),
        isPlaying = false,
        playBtn = document.getElementById('play-btn');

      //initialize data from stream

      // Controls Listeners
      // ----------------------------------------------------------
      if (playBtn != null) {
        playBtn.addEventListener('click', function() {
          togglePlay()
        });
      }

      // Controls & Sounds Methods
      // ----------------------------------------------------------
      function togglePlay() {
        if (player.paused === false) {
          player.pause();
          isPlaying = false;
          document.getElementById('play-btn').className = "";

        } else {
          player.play();
          document.getElementById('play-btn').className = "pause";
          isPlaying = true;
        }
      }
    }());
  }
}

function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
    seconds_int = length - minutes * 60,
    seconds_str = seconds_int.toString(),
    seconds = seconds_str.substr(0, 2),
    time = minutes + ':' + seconds

  return time;
}

function calculateCurrentValue(currentTime) {
  var current_hour = parseInt(currentTime / 3600) % 24,
    current_minute = parseInt(currentTime / 60) % 60,
    current_seconds_long = currentTime % 60,
    current_seconds = current_seconds_long.toFixed(),
    current_time = (current_minute < 10 ? "0" + current_minute : current_minute) + ":" + (current_seconds < 10 ? "0" + current_seconds : current_seconds);

  return current_time;
}
initPlayers(1);
document.getElementById('titleA').innerHTML= getVideoTitleData(idInA);
*/

//initPlayers(jQuery('#player-container').length);
