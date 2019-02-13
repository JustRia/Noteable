// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var tt = require('electron-tooltip'); //lol we'll see
/*
All of the below code is taken from mattdiamond's popular Recordjs plugin found:
https://github.com/mattdiamond/Recorderjs
code will be slightly repurposed for our use
*/

//also waow so many globals

//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext; //new audio context to help us record
var audioBuffer; //this variable will contain the audiobuffer post-recording

var recordButton = document.getElementById("mic-icon");
var recording = false;

//var stopButton = document.getElementById("stopButton");
//var pauseButton = document.getElementById("pauseButton"); 

//add events to those 3 buttons
recordButton.addEventListener("click", startRecording);
//stopButton.addEventListener("click", stopRecording);
//pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    if (!recording) {
        console.log("recordButton clicked");
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
        Disable the record button until we get a success or fail from getUserMedia()
        */

        //recordButton.disabled = true;
        //stopButton.disabled = false;
        //pauseButton.disabled = false

        /*
        We're using the standard promise based getUserMedia()
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
        */

        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            // console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

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

            //console.log("Recording started");

        }).catch(function (err) {
            //enable the record button if getUserMedia() fails
            recordButton.disabled = false;
            //stopButton.disabled = true;
            //pauseButton.disabled = true
        });
    } else {
        stopRecording();
    }
}

/*function pauseRecording() {
    // console.log("pauseButton clicked rec.recording=",rec.recording );
    if (rec.recording) {
        //pause
        rec.stop();
        pauseButton.innerHTML = "Resume";
    } else {
        //resume
        rec.record()
        pauseButton.innerHTML = "Pause";
    }
}
*/

function stopRecording() {
    console.log("stop clicked");
    recording = false;

    //disable the stop button, enable the record to allow for new recordings
    //stopButton.disabled = true;
    //recordButton.disabled = false;
    //pauseButton.disabled = true;

    //reset button just in case the recording is stopped while paused
    //pauseButton.innerHTML = "Pause";

    //tell the recorder to stop the recording
    rec.stop();

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);
    rec.exportWAV(createAudioBuffer);
    console.log("gdi be an audioBuffer?" + audioBuffer);
}
/**The callback above contains the blob in wav format */

function createDownloadLink(blob) {
    console.log(blob);
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
    //console.log("au:" + au);

}

function createAudioBuffer(blob) {

    var arrayBuffer;
    fetch(URL.createObjectURL(blob)).then(res => res.arrayBuffer().then(function (buffer) {
        arrayBuffer = buffer;
        //console.log("I'm an arraybuffer" + arrayBuffer);

        audioContext.decodeAudioData(arrayBuffer, function (buffer) {
            audioBuffer = buffer;
            console.log(audioBuffer);
            console.log(audioBuffer.getChannelData(0));
            syncRecognize(audioBuffer);
            return buffer;
        }, function (e) {
            "Error decoding data"
        });
    }));
}