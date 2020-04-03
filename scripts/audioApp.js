//document.body.addEventListener("click", init, {once: true});
var idInA = "t1TcDHrkQYg";
var idInB = "6W5pq4bIzIw";

var devOpsIsToggled = false;
var RMSA = 0;
var RMSB = 0;

const analyserBufferLength = 4096;


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

  }, false);

  const sendToB = document.getElementById('sendToB');
  sendToB.addEventListener('click', function() {
    let idB = document.getElementById('setIdB');
    let selectionB = document.getElementById('search-results');
    idB.value = selectionB.value;

  }, false);

  /** NI
  const setToA = document.getElementById('meanASET');
  setToA.addEventListener('click', function() {
}, false); **/

/* Button to check loudness of nodes
* Expected behaviour is to raise volume to the loudest node.
* If volume is the same, lower volume of the loudest node.
*/
const setToB = document.getElementById('meanBSET');
setToB.addEventListener('click', function() {
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
      // loudness A is higher -> decrease volume in A //
      document.getElementById('volumeA').value = Number.parseFloat(AIS - BIS*(1-volUP)).toFixed(2);
      console.log("\nA to >" + (BIS - AIS*(1-volUP)));
      gainNodeB.gain.value = Number.parseFloat(BIS - AIS*(1-volUP)).toFixed(4);

    }else if (maxB[1]===1){
      // loudness B is higher -> increase volume in A //
      document.getElementById('volumeA').value = Number.parseFloat(AIS + BIS*volUP).toFixed(2);
      console.log("\nA to >" + (AIS + BIS*volUP));
      gainNodeB.gain.value = Number.parseFloat(AIS + BIS*volUP).toFixed(4);

    }
  } else if (BIS < AIS) {
    // volume a is higher
    if (maxB[1]===0){
      // loudness A is higher -> increase volume in B //
      document.getElementById('volumeB').value = Number.parseFloat(BIS + AIS*volUP).toFixed(2);
      console.log("\nB to >" + Number.parseFloat(BIS + AIS*volUP).toFixed(4));
      gainNodeA.gain.value = Number.parseFloat(BIS + AIS*volUP).toFixed(4);

    }else if (maxB[1]===1){
      // loudness B is higher -> decrease volume in B //
      document.getElementById('volumeB').value = Number.parseFloat(BIS - AIS*(1-volUP)).toFixed(2);
      console.log("\nB to >" + Number.parseFloat(BIS + BIS*volUP).toFixed(4));
      gainNodeA.gain.value = Number.parseFloat(BIS + BIS*volUP).toFixed(4);
    }
  }
}, false);

/* This two options are diabled, for the time being*/
const loopInA = document.getElementById('loopA');
loopInA.addEventListener('change', function() {
  if (loopInA.checked){
    console.log("LOOP");
    document.getElementById("sliderA").disabled = false;
  }else{
    console.log("UNLOOP");
    document.getElementById("sliderA").disabled = true;
  }
}, false);

const loopInB = document.getElementById('loopB');
loopInA.addEventListener('change', function() {
  if (loopInA.checked){
    console.log("LOOP");
    document.getElementById("sliderB").disabled = false;
  }else{
    console.log("UNLOOP");
    document.getElementById("sliderB").disabled = true;
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


}//init



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
  }
});

document.querySelector('#setIdASET').addEventListener('click', function () {
  var audioScope = document.getElementById('audioStreamA');
  audioScope.pause();
  audioScope.innerHTML = '';
  var audioSource = document.createElement('source');
  //let uriString = ('http://localhost:3000/').concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
  let uriString = ''.concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
  audioSource.setAttribute('src', uriString,'type','audio/mpg');
  audioScope.appendChild(audioSource);
  audioScope.load();


  idInA = document.querySelector('#setIdA').value.trim();
  setVideoTitleData(idInA,document.getElementById('titleA'),document.getElementById('durationA'));
  document.getElementById("end-time").innerHTML = calculateTotalValue(document.getElementById('durationA').innerHTML);
  initProgressBar();
  audioScope.play();
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
