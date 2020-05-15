//document.body.addEventListener("click", init, {once: true});
var idInA = "t1TcDHrkQYg";
var idInB = "6W5pq4bIzIw";

var devOpsIsToggled = false;
var setButtonPressed = false; //TODO: Q: make this global or for each sndFx?
var setButtonPressedB = false;

const analyserBufferLength = 4096;
var sndFx_bypassLooperA = false;
var sndFx_bypassLooperB = false;

var player_flag_loop_A = true;
var player_flag_loop_B = true;

/* Check this //
function onLoad(){
  init();
}*/

function init() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  // get the audio element
  const audioElementA = document.querySelector('#audioStreamA');
  const audioElementB = document.querySelector('#audioStreamB');

  // pass it into the audio context
  const trackA = audioContext.createMediaElementSource(audioElementA);
  const trackB = audioContext.createMediaElementSource(audioElementB);

  // a modification control
  const gainNodeA = audioContext.createGain();
  const gainNodeB = audioContext.createGain();

  const gainNodeMaster = audioContext.createGain();
  const gainNodeMA = audioContext.createGain();
  const gainNodeMB = audioContext.createGain();

  const pannerOptions = { pan: 0 };
  const pannerA = new StereoPannerNode(audioContext, pannerOptions);
  const pannerB = new StereoPannerNode(audioContext, pannerOptions);

  // create analyser modules. todo: extract sole buffer
  const a1 = audioContext.createAnalyser();
  a1.fftSize = analyserBufferLength;
  a1.minDecibels = -90;
  a1.maxDecibels = -10;
  a1.smoothingTimeConstant = 0.85;
  const a2 = audioContext.createAnalyser();
  a2.fftSize = analyserBufferLength;
  a2.minDecibels = -90;
  a2.maxDecibels = -10;
  a2.smoothingTimeConstant = 0.85;



  trackA.connect(gainNodeA).connect(a1).connect(pannerA).connect(gainNodeMA).connect(gainNodeMaster);
  trackB.connect(gainNodeB).connect(a2).connect(pannerB).connect(gainNodeMB).connect(gainNodeMaster);
  gainNodeMaster.connect(audioContext.destination);



  // module controls
  // A
  const volumeControlA = document.querySelector('#volumeA');
  volumeControlA.addEventListener('input', function() {
    gainNodeA.gain.value = this.value;
  }, false);

  const pannerControlA = document.querySelector('#pannerA');
  pannerControlA.addEventListener('input', function() {
    pannerA.pan.value = this.value;
  }, false);

  // B
  const volumeControlB = document.querySelector('#volumeB');
  volumeControlB.addEventListener('input', function() {
    gainNodeB.gain.value = this.value;
  }, false);

  const pannerControlB = document.querySelector('#pannerB');
  pannerControlB.addEventListener('input', function() {
    pannerB.pan.value = this.value;
  }, false);

  // Global
  const volumeControlMaster = document.querySelector('#volumeMaster');
  volumeControlMaster.addEventListener('input', function() {
    gainNodeMaster.gain.value = this.value;
  }, false);

  const volumeControlMixer = document.querySelector('#volumeMixer');
  volumeControlMixer.addEventListener('input', function() {
    let mixVal = parseFloat(this.value); //(!)
    gainNodeMA.gain.value =  0.5 - mixVal; //Whats real in mixers?
    gainNodeMB.gain.value =  0.5 + mixVal;
  }, false);
  //

  //The all play button
  const allPlayButton = document.getElementById('playAllButton');
  allPlayButton.addEventListener('click', function() {
    let aSA = document.getElementById('audioStreamA');
    let aSB = document.getElementById('audioStreamB');
    aSA.play();
    aSB.play();
    /* Added after new audio player is installed */
    document.getElementById('play-btn').className = "pause";
    document.getElementById('play-btnB').className = "pause";
  }, false);
  //The all pause button
  const allPauseButton = document.getElementById('pauseAllButton');
  allPauseButton.addEventListener('click', function() {
    let aSA = document.getElementById('audioStreamA');
    let aSB = document.getElementById('audioStreamB');
    aSA.pause();
    aSB.pause();
    /* Added after new audio player is installed */
    document.getElementById('play-btn').className = "";
    document.getElementById('play-btnB').className = "";
  }, false);


  const sendToA = document.getElementById('sendToA');
  sendToA.addEventListener('click', function() {
    let idA = document.getElementById('setIdA');
    let selectionA = document.getElementById('search-results');
    idA.value = selectionA.value;

    // waste an api call
    setVideoTitleValue(selectionA.value,document.getElementById('setIdATitle'));




  }, false);

  const sendToB = document.getElementById('sendToB');
  sendToB.addEventListener('click', function() {
    let idB = document.getElementById('setIdB');
    let selectionB = document.getElementById('search-results');
    idB.value = selectionB.value;

    //waste an api call
    setVideoTitleValue(selectionB.value,document.getElementById('setIdBTitle'));

  }, false);

  /** NI
  const setToA = document.getElementById('meanASET');
  setToA.addEventListener('click', function() {
}, false); **/

/* Buttons for sound effects
 * in particular, setting loops and clips, and recording them
 */
 /* Auto cue buttons */

 /** NOTE: function can be implemented inside audio-player
 * init function, not this one. Check if there are any
 * performance issues if any of them are used. Since it
 * is an asynchronous function there should be no problems.
 * It is written here so that there exists consistency
 * between the audio app and the audio player app in
 * within the project.
 **/
 const sndFx_autoCueButtons = document.getElementsByClassName('ac-btn');
 for (var i=0; i<sndFx_autoCueButtons.length; i++){
   // initialize values!
   this.autoCueAt = 0000;
   // start event listener on click, change to mousedown
   // TODO This is a security concern: duration is in document.getElementById('durationA').innerHTML
   let _length = document.getElementById('durationA').innerHTML;
   sndFx_autoCueButtons[i].addEventListener('click', function(){
      console.log("Button pressed: "+this.id + " at "+setButtonPressed+"\n" + this.id.slice(-3).substring(0,1) + "\n");
      // Now cue to position
      if (!setButtonPressed){
        //NOTE: this are elements in audio-player
        if (this.id.slice(-3).substring(0,1)!="B"){
        document.getElementById('audioStreamA').currentTime=this.autoCueAt;
        document.getElementById('audioStreamA').progressbar=this.autoCueAt/_length;
      }else{
        //document.getElementById('audioStreamB').currentTime=this.autoCueAt;
        //document.getElementById('audioStreamB').progressbar=this.autoCueAt/document.getElementById('durationB').innerHTML;
      }
      }else if (setButtonPressed){
        if (this.id.slice(-3).substring(0,1)!="B"){
          this.autoCueAt = document.getElementById('sliderA').lowValue*_length/100;
          set_sndFxSetButtonPressed(false);
        }else{
          //this.autoCueAt = document.getElementById('sliderB').lowValue*document.getElementById('durationB').innerHTML/100;
          //set_sndFxSetButtonPressedB(false);
        }

        // set marker on ac --
        var innerTag = "AC"+this.id.slice(-1)+"<br>"+calculateTotalValue(this.autoCueAt);
        this.innerHTML = innerTag;

      }


      if (!setButtonPressedB){
        //NOTE: this are elements in audio-player
        if (this.id.slice(-3).substring(0,1)!="B"){
      }else{
        document.getElementById('audioStreamB').currentTime=this.autoCueAt;
        document.getElementById('audioStreamB').progressbar=this.autoCueAt/document.getElementById('durationB').innerHTML;
      }
    }else if (setButtonPressedB){
        if (this.id.slice(-3).substring(0,1)!="B"){
        }else{
          this.autoCueAt = document.getElementById('sliderB').lowValue*document.getElementById('durationB').innerHTML/100;
          set_sndFxSetButtonPressedB(false);
        }
        // set marker on ac --
        var innerTag = "AC"+this.id.slice(-1)+"<br>"+calculateTotalValue(this.autoCueAt);
        this.innerHTML = innerTag;

        }


   }, false);//All of autocue buttons
 }


/* Button to check loudness of nodes
* Expected behaviour is to raise volume to the loudest node.
* If volume is the same, lower volume of the loudest node.
*/
const normB = document.getElementById('normB');
normB.addEventListener('click', function() {
  // Get the 'loudness' measures of the two nodes
  let idA = RMSA; //document.getElementById('RMSA').value;
  let idB = RMSB; //document.getElementById('RMSB').value;

  let maxB = [0,0];
  let minB = [0,0];
  if (idA != idB){
    minB = getMinIArray([idA, idB]);//Math.min(idA,idB);
    maxB = getMaxIArray([idA, idB]); //[m,i] Math.max(idA,idB);
  }

  // increase vol
  let measure = (maxB[0]-minB[0])/maxB[0]; //percentage of max to get to max

  let AIS = document.getElementById('volumeA').value;
  let BIS = document.getElementById('volumeB').value;
  console.log("nrm_pressed"+":measure:"+measure+":maxB:"+maxB+"minB"+minB+":Ais:"+AIS+":Bis:"+BIS+":RMSA:"+RMSA+":RMSB:"+RMSB);

  var volUP = measure;
  if (AIS <= BIS){
    // volume b is higher

    if (maxB[1]===0){
      // loudness A is higher -> decrease volume in A // invert!
      document.getElementById('volumeA').value = Number.parseFloat(AIS - BIS*(1-volUP)).toFixed(2);
      console.log("\nA to >" + (BIS - AIS*(1-volUP)));
      gainNodeB.gain.value = Number.parseFloat(AIS + BIS*(volUP/2)).toFixed(4);
      gainNodeA.gain.value = Number.parseFloat(BIS - BIS*(volUP/2)).toFixed(4);

    }else if (maxB[1]===1){
      // loudness B is higher -> increase volume in A //
      document.getElementById('volumeA').value = Number.parseFloat(AIS + BIS*volUP).toFixed(2);
      console.log("\nA to >" + (AIS + BIS*volUP));
      gainNodeB.gain.value = Number.parseFloat(BIS - BIS*volUP/2).toFixed(4);
      gainNodeA.gain.value = Number.parseFloat(AIS + BIS*(volUP/2)).toFixed(4);

    }
  } else if (BIS < AIS) {
    // volume a is higher
    if (maxB[1]===0){
      // loudness A is higher -> increase volume in B //
      document.getElementById('volumeB').value = Number.parseFloat(BIS + AIS*volUP).toFixed(2);
      console.log("\nB to >" + Number.parseFloat(BIS + AIS*volUP).toFixed(4));
      gainNodeA.gain.value = Number.parseFloat(AIS - AIS*(volUP/2)).toFixed(4);
      gainNodeB.gain.value = Number.parseFloat(BIS + AIS*(volUP/2)).toFixed(4);

    }else if (maxB[1]===1){
      // loudness B is higher -> decrease volume in B // invert!
      document.getElementById('volumeB').value = Number.parseFloat(BIS - AIS*(1-volUP)).toFixed(2);
      console.log("\nB to >" + Number.parseFloat(BIS + BIS*volUP).toFixed(4));
      gainNodeA.gain.value = Number.parseFloat(BIS + AIS*(volUP/2)).toFixed(4);
      gainNodeB.gain.value = Number.parseFloat(AIS - AIS*(volUP/2)).toFixed(4);
    }
  }
}, false);

/* This two options are diabled, for the time being*/
const loopInA = document.getElementById('loopA');
loopInA.addEventListener('change', function() {
  if (loopInA.checked){
    console.log("LOOP");
    player_flag_loop_A = true;
    document.getElementById("sliderA").disabled = false;
    //document.getElementById("sliderA-Mask").style.display ="block";
  }else{
    console.log("UNLOOP");
    document.getElementById("sliderA").disabled = true;
    player_flag_loop_A = false;
    //document.getElementById("sliderA-Mask").style.display ="none";
  }
}, false);

const loopInB = document.getElementById('loopB');
loopInB.addEventListener('change', function() {
  if (loopInB.checked){
    console.log("LOOP");
    document.getElementById("sliderB").disabled = false;
    player_flag_loop_B = true;
  }else{
    console.log("UNLOOP");
    document.getElementById("sliderB").disabled = true;
    player_flag_loop_B = false;
  }
}, false);

// Has to be inside init since it is driven by the animizer frames
function getRMSvalue(val){

  var thisRMSvalue = 0;
  var bufferLength = analyserBufferLength; //a1.fftSize; //Make this a global parameter
  var dataArray = new Uint8Array(bufferLength);
  var freqArray = new Uint8Array(bufferLength);

  if (val==="A"){
    var al=a1;
  }else if (val==="B"){
    var al=a2;
  }

  var _valueRMS = 0;
  var thisFrame = function() {
    thisFrameAnimation = requestAnimationFrame(thisFrame);

    al.getByteTimeDomainData(dataArray);
    al.getByteFrequencyData(freqArray);

    _valueRMS = calcRMSUint8(dataArray, bufferLength);
    if (val==="A"){
      RMSA=_valueRMS;

      if (devOpsIsToggled){
        document.getElementById('RMSA').value=_valueRMS;
        document.getElementById('meanEnvelopeA').value ="computing";
      }
    }else if (val==="B"){
      RMSB=_valueRMS;

      if (devOpsIsToggled){
        document.getElementById('RMSB').value=_valueRMS;
        document.getElementById('meanEnvelopeB').value ="computing";
      }
    }
  }

  thisFrame();
}



getRMSvalue("A");
getRMSvalue("B");


//-------------- DEV

_drawAudio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/shoptalk-clip.mp3',audioContext);

//--------------


}//init

//TODO: i thought this one was defined!!!
function set_sndFxSetButtonPressed(value){
  if (value) {
      console.log("setButton value TRUE!"+value);
      setButtonPressed = value;
    }else{
    /*
    else if (!value){
      console.log("setButton value FALSE!");
      setButtonPressed = false;
  }else { //let undefined in case it is toggled
      console.log("setButton value is undefined, I will toggle it!")
      setButtonPressed = !setButtonPressed;
  }*/
 setButtonPressed = !setButtonPressed;
}
 console.log("setButton value"+setButtonPressed);
//what u with boolean? :/
console.log(setButtonPressed);
if (setButtonPressed){
  console.log("setButton value"+setButtonPressed);
  document.getElementById('sliderA').children[0].style.setProperty('--shadowColoer','rgba(62, 189, 240, 1)');
 document.getElementById('set-ac').className = "fx-btn-selected";
 //document.getElementById('sliderA').className = "slider-selected";

}else if (!(setButtonPressed)){
  document.getElementById('sliderA').children[0].style.setProperty('--shadowColoer','#607d8b');
  document.getElementById('set-ac').className = "fx-btn";
}
}

function set_sndFxSetButtonPressedB(value){
setButtonPressedB = !setButtonPressedB;
 console.log("setButton value"+setButtonPressedB);
if (setButtonPressedB){
 disableLoop(document.getElementById('loopB'),true,'B');
 document.getElementById('sliderB').children[0].style.setProperty('--shadowColoer','rgba(62, 189, 240, 1)');
 document.getElementById('set-acB').className = "fx-btn-selected";
}else if (!setButtonPressedB){
  document.getElementById('sliderB').children[0].style.setProperty('--shadowColoer','#607d8b'); //Same as in multirangesp.css
  document.getElementById('set-acB').className = "fx-btn";
}
}

// ToDO: Rethink behaviour
/* '## Deprecated ##
document.querySelector('#setIdA').addEventListener('keypress', function (e) {
if (e.key === 'Enter') {
var audioScope = document.getElementById('audioStreamA');
audioScope.pause();
audioScope.innerHTML = '';
var audioSource = document.createElement('source');
let uriString = ('http://localhost:3000/').concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
audioSource.setAttribute('src', uriString,'type','audio/mpg');
audioScope.appendChild(audioSource);
audioScope.load();
}
});
## */

//Deprecate:::
/**
document.querySelector('#setIdB').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    var audioScope = document.getElementById('audioStreamB');
    audioScope.pause();
    audioScope.innerHTML = '';
    var audioSource = document.createElement('source');
    //let uriString = ('http://localhost:3000/').concat('audio2','?','songId=',document.querySelector('#setIdB').value.trim());
    let uriString = ''.concat('audio2','?','songId=',document.querySelector('#setIdB').value.trim());
    audioSource.setAttribute('src', uriString,'type','audio/mpg');
    audioScope.appendChild(audioSource);
    audioScope.load();

    idInB = document.querySelector('#setIdB').value.trim();
    setVideoTitleData(idInB,document.getElementById('titleB'),document.getElementById('durationB'),document.getElementById('end-timeB'));
    //document.getElementById("end-timeB").innerHTML = calculateTotalValue(document.getElementById('durationB').innerHTML);
    initProgressBarB();

    audioScope.play();
  }
});
**/

document.querySelector('#setIdASET').addEventListener('click', function () {
  var audioScope = document.getElementById('audioStreamA');
  audioScope.pause();
  audioScope.innerHTML = '';
  var audioSource = document.createElement('source');
  //let uriString = ('http://localhost:3000/').concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
  let uriString = ''.concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
  audioSource.setAttribute('src', uriString,'type','audio/mpg');
  audioScope.appendChild(audioSource);



  idInA = document.querySelector('#setIdA').value.trim();
  setVideoTitleData(idInA,document.getElementById('titleA'),document.getElementById('durationA'),document.getElementById('end-time'));
  //document.getElementById("end-time").innerHTML = calculateTotalValue(document.getElementById('durationA').innerHTML);
  initProgressBar();

  //loop
  let _loopInA = document.getElementById('loopA');
  disableLoop(_loopInA, true, 'A');

  audioScope.load(); //Note: seems that audioscope autoplays on load!
  audioScope.play();
  document.getElementById('play-btn').className = "pause";
});

document.querySelector('#setIdBSET').addEventListener('click', function () {
  var audioScope = document.getElementById('audioStreamB');
  audioScope.pause();
  audioScope.innerHTML = '';
  var audioSource = document.createElement('source');
  //let uriString = ('http://localhost:3000/').concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
  let uriString = ''.concat('audio2','?','songId=',document.querySelector('#setIdB').value.trim());
  audioSource.setAttribute('src', uriString,'type','audio/mpg');
  audioScope.appendChild(audioSource);

  idInB = document.querySelector('#setIdB').value.trim();
  setVideoTitleData(idInB,document.getElementById('titleB'),document.getElementById('durationB'),document.getElementById('end-timeB'));
  //document.getElementById("end-time").innerHTML = calculateTotalValue(document.getElementById('durationA').innerHTML);
  initProgressBarB();

  let _loopInB = document.getElementById('loopB');
  disableLoop(_loopInB, true, 'B');

  audioScope.load();
  audioScope.play();
  document.getElementById('play-btnB').className = "pause";
});

function toggleDevOps(){var x = document.getElementById("dev-options");
if (x.style.display === "none") {
  x.style.display = "block";
  document.getElementById("devOpsButton").innerHTML =" v ";
  devOpsIsToggled = true;
} else {
  x.style.display = "none";
  document.getElementById("devOpsButton").innerHTML =" > ";
  devOpsIsToggled = false;
}}

/** TODO: implement playlist is toggled **/
function togglePlayList(){var x = document.getElementById("iu-playlist");
if (x.style.display === "none") {
  x.style.display = "block";
  document.getElementById("playListButton").innerHTML =" v ";
  //playliIsToggled = true;
} else {
  x.style.display = "none";
  document.getElementById("playListButton").innerHTML =" > ";
  //playliIsToggled = false;
}}

/** TODO: implement playlist is toggled **/
/** TODO: element is also set toggle button? **/
/** TODO: create coding guidelines **/
function toggleSndFx(){var x = document.getElementById("fx-menu");
if (x.style.visibility === "hidden") {
  x.style.visibility = "visible";
  x.style.width="100%";
  x.style.height="100%";
  x.style.opacity="1";
  //console.log(x);
  //console.log(document.getElementById("sndFx-MainButton"));
  //document.getElementById("sndFx-MainButton").innerHTML ="";
  //document.getElementById("sndFx-MainButton").style.box-shadow ="2px 2px 5px rgba(213, 231, 5, 0.8), -2px -2px 5px rgba(213, 231, 5, 0.8), -2px 2px 5px rgba(213, 231, 5, 0.8), 2px -2px 5px rgba(213, 231, 5, 0.8)";
  //playliIsToggled = true;
  document.getElementById('sndFx-MainButton').className = "fx-btn menu-btn-active";
} else {
  x.style.visibility = "hidden";
  x.style.width="0px";
  x.style.height="0px"
  x.style.opacity="0";

  //document.getElementById("sndFx-MainButton").innerHTML ="";
  //document.getElementById("sndFx-MainButton").style.box-shadow ="none;";
  //playliIsToggled = false;
  document.getElementById('sndFx-MainButton').className = "fx-btn menu-btn";
}}

/** TODO: implement playlist is toggled **/
/** TODO: element is also set toggle button? **/
/** TODO: create coding guidelines **/
function toggleSndFxB(){var x = document.getElementById("fx-menuB");
if (x.style.visibility === "hidden") {
  x.style.visibility = "visible";
  x.style.width="100%";
  x.style.height="100%";
  x.style.opacity="1";
  document.getElementById('sndFx-MainButtonB').className = "fx-btn menu-btn-active";
} else {
  x.style.visibility = "hidden";
  x.style.width="0px";
  x.style.height="0px"
  x.style.opacity="0";
  document.getElementById('sndFx-MainButtonB').className = "fx-btn menu-btn";
}}

//## audio-player
function disableLoop(_loopHandler, disableFlag, _which){
  if (disableFlag){
    if (_loopHandler.checked){
      //same as calling on change function?
        console.log("UNLOOP");
        //deprecated
        //document.getElementById("sliderA").disabled = true;
        if (_which === 'A'){
        player_flag_loop_A = false;
      }
        if (_which === 'B'){
        player_flag_loop_B = false;
        }
        _loopHandler.checked=false;
      }
  }else if (!disableFlag){
    if (!_loopHandler.checked){
      //same as calling on change function?
        console.log("LOOP");
        //deprecated
        //document.getElementById("sliderA").disabled = true;
        if (_which === 'A'){
        player_flag_loop_A = true;
      }
        if (_which === 'B'){
        player_flag_loop_B = true;
        }
        _loopHandler.checked=true;
      }
  }
}


/**
* @param length time in seconds
* @return a string with minutes:seconds
**/
function calculateTotalValue(length) {
  var minutes = Math.floor(length / 60),
    seconds_int = length - minutes * 60,
    seconds_str = Math.floor(seconds_int).toString(),
    seconds = seconds_str.substr(0, 2);
    //https://stackoverflow.com/questions/8935414/getminutes-0-9-how-to-display-two-digit-numbers
    time = minutes + ':' + ('00'+seconds).slice(-2);

  return time;
}

/*## jash*/
//According to the sliding window approach
function getWaveEnvelope(dataBuff,length){
  let bufferLength = dataBuff.length;
  var tempB = new Float64Array(bufferLength);
  for(var i = 0; i < bufferLength; i++) {
    thisVal=0;
    var firstW=0;
    var secondW=0;
    //Copy first window
    if (i < length){
      tempB[i]=0;
    }else if(i > (bufferLength-length) ){
      tempB[i]=0;
    }else{
      firstW = Math.max.apply(null,dataBuff.slice(i-length+1,i).map(Math.abs));
      secondW = Math.max(dataBuff.slice(i,i+length-1));
    }
    tempB[i]=Math.min(firstW,secondW);
  }

  return tempB;
}

const cumulativeSum = (sum => value => sum += value)(0);


function getMaxIArray(_dataArrayBuffer) {
  var maxIndex = new Array(2).fill(0); //Persistent ()?!)
  if (_dataArrayBuffer.length === 0) {
    return maxIndex;
  }

  var max = _dataArrayBuffer[0];
  maxIndex[0] = max;

  for (var i = 1; i < _dataArrayBuffer.length; i++) {
    if (_dataArrayBuffer[i] > max) {
      maxIndex[0] = _dataArrayBuffer[i];
      maxIndex[1] = i;
    }
  }

  return maxIndex;
}


function getMinIArray(_dataArrayBuffer) {
  var minIndex = new Array(2).fill(0); //Persistent ()?!)
  if (_dataArrayBuffer.length === 0) {
    return minIndex; // and dont return nulls
  }

  var min = _dataArrayBuffer[0];
  minIndex[0]= min;

  for (var i = 1; i < _dataArrayBuffer.length; i++) {
    if (_dataArrayBuffer[i] < min) {
      minIndex[0] = _dataArrayBuffer[i];
      minIndex[1] = i;
    }
  }

  return minIndex;
}



function calcRMSUint8(dataArray, bufferLength){

  var envelope = new Uint8Array(bufferLength);

  var cumSum = 0.0;
  for(var i = 0; i < bufferLength; i++) {
    cumSum += Math.pow(parseFloat((dataArray[i]/128 - 1)),2);
  }
  var _rmsValue = Math.pow(cumSum/bufferLength,0.5).toFixed(4);
  return _rmsValue;
}
