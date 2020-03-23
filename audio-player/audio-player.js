function initProgressBar() {
  var player = document.getElementById('audioStreamA');
  var length = player.duration
  var current_time = player.currentTime;

console.log(player.metadata);
  // calculate total length of value
  var totalLength = calculateTotalValue(length)
  document.getElementById("end-time").innerHTML = totalLength;

  // calculate current value time
  var currentTime = calculateCurrentValue(current_time);
  document.getElementById("start-time").innerHTML = currentTime;

  var progressbar = document.getElementById('seek-obj');
  progressbar.value = (player.currentTime / player.duration);
  progressbar.addEventListener("click", seek);

  if (player.currentTime == player.duration) {
    document.getElementById('play-btn').className = "";
  }

  function seek(event) {
    var percent = event.offsetX / this.offsetWidth;
    player.currentTime = percent * player.duration;
    progressbar.value = percent / 100;
  }
};

function initPlayers(num) {
  // pass num in if there are multiple audio players e.g 'player' + i
  for (var i = 0; i < num; i++) {
    (function() {
      if (num===1){
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




      }else if (num===2){

        var playerContainer = document.getElementById('player-containerB'),
          player = document.getElementById('audioStreamB'),
          isPlaying = false,
          playBtn = document.getElementById('play-btnB');
                if (playBtn != null) {
                  playBtn.addEventListener('click', function() {
                    togglePlayB()
                  });
                }
            function togglePlayB() {
                  if (player.paused === false) {
                    player.pause();
                    isPlaying = false;
                    document.getElementById('play-btnB').className = "";

                  } else {
                    player.play();
                    document.getElementById('play-btnB').className = "pause";
                    isPlaying = true;
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
initPlayers(2);
setVideoTitleData(idInA,document.getElementById('titleA'));
setVideoTitleData(idInB,document.getElementById('titleB'));

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
