/*
Most of the below code is utilizing mattdiamond's popular Recordjs plugin found:
https://github.com/mattdiamond/Recorderjs
code will be slightly repurposed for our use
*/

const {
    promisify
} = require('util');
var note_detection = require("./note-detection.js");
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var recordButton = document.getElementById("mic-icon");
var stopButton = document.getElementById("stop-icon");
var retryButton = document.getElementById("retry-icon");
var recording = false;
var detectTempoButton = document.getElementById("detect-tempo-button");
var tempoCountdown = document.getElementById("tempo-countdown");
var tempoInput = document.querySelector("input[name='tempo']");
var detectingTempoContent = document.getElementById("detecting-tempo-div");
var detectKeyCheckbox = document.getElementById("auto-detect-key-signature");
var taps;
var startTime, endTime;
var detectingTempo = false;
var tempoBPM;
var timer;
var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording
var AudioContext = window.AudioContext || window.webkitAudioContext; // shim for AudioContext when it's not avb.
var audioContext = new AudioContext; //new audio context to help us record
var audioBuffer; //this variable will contain the audiobuffer post-recording
var measures = [];
var detectKeyFlag = false;

recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
retryButton.addEventListener("click", retryRecording);
detectTempoButton.addEventListener("click", startDetectTempo);
document.addEventListener("keypress", keyPress);
detectKeyCheckbox.addEventListener("click", toggleDetectKey);

function startRecording() {
    if (!recording) {
        if (!document.getElementById("mic-icon").classList.contains("disabled-button")) {
            document.getElementById("mic-icon").classList.add("hidden");
            document.getElementById("stop-icon").classList.add("disabled-button");
            document.getElementById("stop-icon").classList.remove("hidden");
            document.getElementById("metronome-main-content").classList.remove("hidden");
            document.getElementById("input-main-content").classList.add("hidden");

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
                startMetronome();
                //rec.record();

            }).catch(function (err) {
                recordButton.disabled = false;
            });
        }
    } else {
        stopRecording();
    }
}

function stopRecording() {
    if (!document.getElementById("stop-icon").classList.contains("disabled-button")) {
        recording = false;
        document.getElementById("stop-icon").classList.add("hidden");
        rec.stop();
        stopMetronome();
        //stop microphone access
        gumStream.getAudioTracks()[0].stop();

        //create the wav blob and pass it on
        //rec.exportWAV(createDownloadLink);
        rec.exportWAV(createAudioBuffer);
        rec.clear();
        // remove metronome and show progress bar
        document.getElementById("metronome-main-content").classList.add("hidden");
        document.getElementById("progress-bar-main-content").classList.remove("hidden");
    }
}

function retryRecording() {
    // hide sheet music and go back to input screen
    document.getElementById("sheet-music-main-content").classList.add("hidden");
    document.getElementById("input-main-content").classList.remove("hidden");
    // hide the retry button and show the record button
    document.getElementById("retry-icon").classList.add("hidden");
    document.getElementById("mic-icon").classList.remove("hidden");
    // reset the progress bar
    progress = [0,0,0,0,0];
    document.getElementById("progress-fill").style.width = 1 + "%";
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
                    // Note-detection
                    measures = note_detection.get_notes(audioBuffer, time_signature_top_num_input, time_signature_bottom_num_input, tempo_input);
                    // Key detection
                    if (detectKeyFlag) {
                        key_signature_input = detectKey(measures);
                        if (key_signature_input == undefined) {
                            key_signature_input = "C";
                        }
                    }
                    updateProgress("auto-detect-key");
                    // Speech to text
                    syncRecognize(blob, audioBuffer.sampleRate, measures);
                }, function (e) {
                    "Error decoding data"
                }));
            }
        });
    });
}

// Show tempo detection interface
function startDetectTempo() {
    detectingTempoContent.classList.remove("hidden");
    detectingTempo = true;
    taps = 10;
    tempoCountdown.innerText = "" + taps + " times";
    detectTempoButton.blur();
}

// Tempo detection
function keyPress(e) {
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
                detectingTempoContent.classList.add("hidden");
            }
        }
    }
}

// Toggle key detection with checkbox
function toggleDetectKey() {
    if (detectKeyFlag) {
        detectKeyFlag = false;
    } else {
        detectKeyFlag = true;
    }
}

function startMetronome() {
    //create text for countdown and append it to the html
    var cd = document.getElementById("countdown");
    var countFrom = time_signature_top_num_input;
    var count = document.createTextNode(countFrom);
    cd.appendChild(count);

    //visual + text for metronome
    var circ = document.getElementById("circ");
    circ.classList.add("circle");
    if (circ.childNodes.length > 0) {
        circ.removeChild(circ.childNodes[0]);
    }
    var text = document.createTextNode(tempo_input + " BPM");
    circ.appendChild(text);

    //start the countdown based on the tempo
    timer = window.setInterval(function () { //decrement on the beat?
        document.getElementById("countdown").innerHTML = "" + countFrom;
        if (countFrom == 0) {
            //remove the countdown text
            document.getElementById("countdown").innerHTML = "Go!";
            //clean
            //window.clearInterval(timerBoi);
            document.getElementById("stop-icon").classList.remove("disabled-button");
            rec.record();
        } else {
            countFrom = countFrom - 1;
        }
        document.getElementById("circ").classList.add('shadow');
        window.setTimeout(function () {
            document.getElementById("circ").classList.remove('shadow');
        }, 100)
    }, 60000 / tempo_input);
}

function stopMetronome() {
    window.clearInterval(timer);
    document.getElementById("circ").classList.toggle('paused');
    document.getElementById("countdown").innerHTML = "";
}
