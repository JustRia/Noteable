import Recorder from 'recorder-js';

var go = false;

const audioContext =  new (window.AudioContext || window.webkitAudioContext)();
 
const recorder = new Recorder(audioContext, {
  // An array of 255 Numbers
  // You can use this to visualize the audio stream
  // If you use react, check out react-wave-stream
  onAnalysed: data => console.log(data),
});
 
let isRecording = false;
let blob = null;
 
navigator.mediaDevices.getUserMedia({audio: true})
  .then(stream => recorder.init(stream))
  .catch(err => console.log('Uh oh... unable to get stream...', err));
 
function startRecording() {
    console.log("yo");
  recorder.start()
    .then(() => isRecording = true);
}
 
function stopRecording() {
  recorder.stop()
    .then(({blob, buffer}) => {
      blob = blob;
      // buffer is an AudioBuffer
    });
}
 
function download() {
  Recorder.download(blob, 'my-audio-file'); // downloads a .wav file
}

function recordCheck() {
  var c = document.getElementByName="click";
  c.addEventListener('click', record);

  function record() {
    console.log("go" + go);
    go ? true : false;
    go ? stopRecording() : startRecording();
  }
};