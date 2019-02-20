/*
Most of the below code is utilizing mattdiamond's popular Recordjs plugin found:
https://github.com/mattdiamond/Recorderjs
code will be slightly repurposed for our use
*/
const {
    promisify
} = require('util');
var note_detection = require("./note-detection.js")
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var recordButton = document.getElementById("mic-icon");
var recording = false;
var detectTempoButton = document.getElementById("detect-tempo-button");
var tempoCountdown = document.getElementById("tempo-countdown");
var tempoInput = document.querySelector("input[name='tempo']");
var detectingTempoContent =  document.getElementById("detecting-tempo-div");
var taps;
var startTime, endTime;
var detectingTempo = false;
var tempoBPM;
var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
var AudioContext = window.AudioContext || window.webkitAudioContext; // shim for AudioContext when it's not avb. 
var audioContext = new AudioContext; //new audio context to help us record
var audioBuffer; //this variable will contain the audiobuffer post-recording
var measures = [];

recordButton.addEventListener("click", startRecording);
detectTempoButton.addEventListener("click", startDetectTempo);
document.addEventListener("keypress", keyPress);

function startRecording() {
    if (!recording) {

        recording = true;

        /*
        Simple constraints object, for more advanced audio features see
        <div class="video-container"><blockquote class="wp-embedded-content" data-secret="cVHlrYJoGD"><a href="https://addpipe.com/blog/audio-constraints-getusermedia/">Supported Audio Constraints in getUserMedia()</a></blockquote><iframe class="wp-embedded-content" sandbox="allow-scripts" security="restricted" style="position: absolute; clip: rect(1px, 1px, 1px, 1px);" src="https://addpipe.com/blog/audio-constraints-getusermedia/embed/#?secret=cVHlrYJoGD" data-secret="cVHlrYJoGD" width="600" height="338" title="“Supported Audio Constraints in getUserMedia()” — Pipe Blog" frameborder="0" marginwidth="0" marginheight="0" scrolling="no"></iframe></div>
        */

        var constraints = {
            audio: true,
            video: false
        }

        /*
        We're using the standard promise based getUserMedia()
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {

            /* assign to gumStream for later use */
            gumStream = stream;

            /* use the stream */
            input = audioContext.createMediaStreamSource(stream);

            /* 
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
            */
            rec = new Recorder(input, {
                numChannels: 1
            })

            //start the recording process
            rec.record()

        }).catch(function (err) {
            recordButton.disabled = false;
        });
    } else {
        stopRecording();
    }
}

function stopRecording() {
    recording = false;
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
    rec.exportWAV(createAudioBuffer);
    rec.clear();
}

/**The callback above contains the blob in wav format */

function createDownloadLink(blob) {
    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');
    var link = document.createElement('a');

    //add controls to the <audio> element in the html file to play stuff
    au.controls = true;
    au.src = url;

    //link the a element to the blob
    link.href = url;
    link.download = new Date().toISOString() + '.wav';
    link.innerHTML = link.download;

    //add the new audio and a elements to the li element
    li.appendChild(au);
    li.appendChild(link);

    //add the li element to the ordered list
    recordingsList.appendChild(li);

}

function createAudioBuffer(blob) {
    var readBlob = require('read-blob');
    return new Promise(function (resolve, reject) {
        readBlob(blob, 'arraybuffer', function (err, arraybuffer) {
            if (err) {
                reject(err);
            } else {
                resolve(audioContext.decodeAudioData(arraybuffer, function (buffer) {
                    audioBuffer = buffer;
                    // Speech to text
                    syncRecognize(blob, audioBuffer.sampleRate);
                    measures = note_detection.get_notes(audioBuffer, "4/4", 80);
                }, function (e) {
                    "Error decoding data"
                }));
            }
        });
    });
}

// Show tempo detection interface
function startDetectTempo () {
    detectingTempoContent.classList.remove("hidden");
    detectingTempo = true;
    taps = 10;
    tempoCountdown.innerText = "" + taps + " times";
    detectTempoButton.blur();
}

// Tempo detection 
function keyPress (e) {
    if (detectingTempo) {
        if (e.keyCode == 32) {
            e.preventDefault();
            if (taps == 10) {
                startTime = new Date();
            }
            taps--;
            tempoCountdown.innerText = "" + taps + " times";
            if (taps == 0) {
                detectingTempo = false;
                endTime = new Date();
                var elapsedTime = endTime.getTime() - startTime.getTime();
                tempoBPM = 9 / (elapsedTime / 60000);
                console.log(tempoBPM);
                tempoInput.value = Math.round(tempoBPM);
                detectingTempoContent.classList.add("hidden")
            }
        }
    }
}