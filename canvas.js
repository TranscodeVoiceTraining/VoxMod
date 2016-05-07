var voxmod = voxmod || {};

// fork getUserMedia for multiple browser versions, for those
// that need prefixes 
//TODO: Change to use navigator.mediaDevices.getUserMedia() (GitHib issue #1)
navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

// set up forked web audio context, for multiple browsers
// window. is needed otherwise Safari explodes

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var voiceSelect = document.getElementById("voice");
var source;
var stream;

// grab the mute button to use below

var mute = document.querySelector('.mute');

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var analyser2 = audioCtx.createAnalyser();
analyser2.minDecibels = -90;
analyser2.maxDecibels = -10;
analyser2.smoothingTimeConstant = 0.85;

var distortion = audioCtx.createWaveShaper();
var gainNode = audioCtx.createGain();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();

// set up canvas context for visualizer

var canvas = document.querySelector('.visualizer');
var canvasCtx = canvas.getContext("2d");

var intendedWidth = document.querySelector('.wrapper').clientWidth;

canvas.setAttribute('width',intendedWidth);

var drawVisual;


var MATHS = {
  //mathematical functions
  meanOfArray: function (array){
    var sumOfItems = 0;
    for (var i = 0; i < array.length; i++) {
      sumOfItems += array[i];
    }
    return sumOfItems / array.length;
  },

  standardDeviation: function (array){
    var mean = this.meanOfArray(array);
    var variance =array.reduce(function(a,b){
      return Math.pow((mean - b),2) + a;
    }, 0)/array.length;

    return Math.sqrt(variance);
   }
};
Object.freeze(MATHS);

voxmod.maths = MATHS;

//Setup recording if supported by browser
if (navigator.getUserMedia) {
   navigator.getUserMedia (
      // constraints - only audio needed for this app
      {audio: true},

      // Success callback
      function(stream) {
         source = audioCtx.createMediaStreamSource(stream);
         source.connect(analyser);
         analyser.connect(analyser2);
         // distortion.connect(biquadFilter);
         // biquadFilter.connect(convolver);
         // convolver.connect(gainNode);
         // gainNode.connect(audioCtx.destination);
         //distortion.connect(audioCtx.destination);

      	 visualize();
      },

      // Error callback
      function(err) {
         console.log('The following gUM error occured: ' + err);
      }
   );
} else {
   console.log('getUserMedia not supported on your browser!');
   alert("VoxMod does not currently support this browser. We recommend using a modern browser like Firefox or Chrome");
}

function visualize() {
  WIDTH = canvas.width;
  HEIGHT = canvas.height;
  // var numberOfFrames = 0;
  var listOfPitches = [];
  
  analyser.fftSize = 2048;
  var bufferLength = analyser.fftSize;
  console.log(bufferLength);
  var dataArray = new Uint8Array(bufferLength);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  function meanPitchSoFar(){
    return voxmod.maths.meanOfArray(listOfPitches);
  }

  function standardDeviationOfPitches(){
    return voxmod.maths.standardDeviation(listOfPitches);
  }

  //TODO: move this out of the visualise function if possible
  function saveVoiceData() {
      var voiceData = { averagePitch: meanPitchSoFar(), pitchVariance: standardDeviationOfPitches(), timestamp: new Date() };
      //TODO: make this a global (namespaced) constant or something?
      var voiceHistoryKey = 'VoiceAnalysisHistory';
      var voiceHistory = voxmod.storage.load(voiceHistoryKey) || [];
      voiceHistory.push(voiceData);
      voxmod.storage.save(voiceHistoryKey, voiceHistory);
  }

  $('#finish-recording').click(function () { saveVoiceData(); return true; });

  function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);
    var YINDetector = PitchFinder.AMDF();
    var estimate = YINDetector(dataArray);
    if(estimate.freq != -1) {
       document.getElementById("currentPitch").innerHTML = estimate.freq.toFixed(2);
       // numberOfFrames++;
       listOfPitches.push(estimate.freq);
       //TODO mathematically round before adding to array? toFixed returns string and not sure of fast way to round to 2 DP
       document.getElementById("averagePitch").innerHTML = meanPitchSoFar().toFixed(2);
       document.getElementById("pitchVariance").innerHTML =
             standardDeviationOfPitches().toFixed(2);
     }

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;

    for(var i = 0; i < bufferLength; i++) {
 
      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height/2);
    canvasCtx.stroke();
  };

  draw();

  //==BELOW is code for alternative graph, we may want to implement this
  // as it's more informative than the waveform==

   // else if(false/*visualSetting == "frequencybars"*/) {
   //  analyser.fftSize = 256;
   //  var bufferLength = analyser.frequencyBinCount;
   //  console.log(bufferLength);
   //  var dataArray = new Uint8Array(bufferLength);

   //  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

   //  function draw() {
   //    drawVisual = requestAnimationFrame(draw);

   //    analyser.getByteFrequencyData(dataArray);
   //    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
   //    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

   //    var barWidth = (WIDTH / bufferLength) * 2.5;
   //    var barHeight;
   //    var x = 0;

   //    for(var i = 0; i < bufferLength; i++) {
   //      barHeight = dataArray[i];

   //      canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
   //      canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth,barHeight/2);

   //      x += barWidth + 1;
   //    }
   //  };

   // draw();
}

//Commented out mute functionality, may want a "pause" feature later on though
// mute.onclick = voiceMute;

// function voiceMute() {
//   if(mute.id == "") {
//     gainNode.gain.value = 0;
//     mute.id = "activated";
//     mute.innerHTML = "Unmute";
//   } else {
//     gainNode.gain.value = 1;
//     mute.id = "";    
//     mute.innerHTML = "Mute";
//   }
// }
