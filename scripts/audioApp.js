document.body.addEventListener("click", init, {once: true});

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

trackA.connect(gainNodeA).connect(pannerA).connect(gainNodeMA).connect(gainNodeMaster);
trackB.connect(gainNodeB).connect(pannerB).connect(gainNodeMB).connect(gainNodeMaster);
gainNodeMaster.connect(audioContext.destination)
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
  console.log("Heeeeeeeeeeeeeeeeeeeeere");
}, false);
//The all pause button
const allPauseButton = document.getElementById('pauseAllButton');
allPauseButton.addEventListener('click', function() {
  let aSA = document.getElementById('audioStreamA');
  let aSB = document.getElementById('audioStreamB');
  aSA.pause();
  aSB.pause();
  console.log("Tooooooooooooooooower")
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

document.querySelector('#setIdB').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      var audioScope = document.getElementById('audioStreamB');
      audioScope.pause();
      audioScope.innerHTML = '';
      var audioSource = document.createElement('source');
      let uriString = ('http://localhost:3000/').concat('audio2','?','songId=',document.querySelector('#setIdB').value.trim());
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
      let uriString = ('http://localhost:3000/').concat('audio1','?','songId=',document.querySelector('#setIdA').value.trim());
      audioSource.setAttribute('src', uriString,'type','audio/mpg');
      audioScope.appendChild(audioSource);
      audioScope.load();
});
