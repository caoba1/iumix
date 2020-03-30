document.body.addEventListener("click", init, {once: true});
var idInA = "t1TcDHrkQYg";
var idInB = "6W5pq4bIzIw";


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
a1.fftSize = 4096;
a1.minDecibels = -90;
a1.maxDecibels = -10;
a1.smoothingTimeConstant = 0.85;
const a2 = audioContext.createAnalyser();
a2.fftSize = 4096;
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
  document.getElementById('play-btn').className = "pause";
}, false);
//The all pause button
const allPauseButton = document.getElementById('pauseAllButton');
allPauseButton.addEventListener('click', function() {
  let aSA = document.getElementById('audioStreamA');
  let aSB = document.getElementById('audioStreamB');
  aSA.pause();
  aSB.pause();
  /* Added after new audio player is installed */
  document.getElementById('play-btnB').className = "";
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


const setToA = document.getElementById('meanASET');
setToA.addEventListener('click', function() {
}, false);

const setToB = document.getElementById('meanBSET');
setToB.addEventListener('click', function() {
  let idA = document.getElementById('RMSA').value;
  let idB = document.getElementById('RMSB').value;
  let minB = Math.min(idA,idB);
  let maxB = Math.max(idA,idB);
  // increase vol
  let measure = (maxB-minB)/maxB;

  let AIS = document.getElementById('volumeA').value;
  let BIS = document.getElementById('volumeB').value;
    console.log("nrm pressed");
    if (idA < idB){
        var volUP = measure;
        document.getElementById('volumeA').value = AIS + BIS*volUP;
        console.log("a"+AIS+",b"+BIS,"up"+measure);
        gainNodeA.gain.value = AIS + BIS*volUP;
        console.log("TOA");

}else if (idB < idA){
        var volUP = measure;
        document.getElementById('volumeB').value = BIS + AIS*volUP;
        console.log("a"+AIS+",b"+BIS,"up"+measure);
        gainNodeB.gain.value = BIS + AIS*volUP;
        console.log("TOb");
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

//
function getRMSvalue(val){

var thisRMSvalue = 0;
var bufferLength = a1.fftSize; //Make this a global parameter
var dataArray = new Uint8Array(bufferLength);
var freqArray = new Uint8Array(bufferLength);



if (val==="A"){
var al=a1;
var thisElementId = document.getElementById('RMSA');
var thisElementIdMean = document.getElementById('meanEnvelopeA');
}else if (val==="B"){
var al=a2;
var thisElementId = document.getElementById('RMSB');
var thisElementIdMean = document.getElementById('meanEnvelopeB');
}

var envelope = new Uint8Array(bufferLength);

var thisFrame = function() {
thisFrameAnimation = requestAnimationFrame(thisFrame);

al.getByteTimeDomainData(dataArray);
al.getByteFrequencyData(freqArray);
var cumSum = 0.0;
for(var i = 0; i < bufferLength; i++) {
            cumSum += Math.pow(parseFloat((dataArray[i]/128 - 1)),2);
            }
thisElementId.value = Math.pow(cumSum/bufferLength,0.5).toFixed(4);

/*envelope = getWaveEnvelope(dataArray,200);
thisElementIdMean.value = envelope.map(cumulativeSum)/(bufferLength-1200*2);
*/
thisElementIdMean.value ="computing";

};

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
