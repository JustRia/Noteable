/*
Most of the below code is utilizing mattdiamond's popular Recordjs plugin found:
https://github.com/mattdiamond/Recorderjs
code will be slightly repurposed for our use
*/
const {
    promisify
} = require('util');
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

recordButton.addEventListener("click", startRecording);

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
    
    rec.getBuffer(testBuff);
    //rec.getBuffer(testBuff);
    //rec.exportWAV(createAudioBuffer);
    //rec.exportWAV(blobToFile);
    rec.clear();
}

function testBuff(buffers) {
    // console.log(buffers);
    // console.log("buffers:" + buffers[0]);
    var newSource = audioContext.createBufferSource();
    var newBuffer = audioContext.createBuffer(1, buffers[0].length, audioContext.sampleRate);
    newBuffer.getChannelData(0).set(buffers[0]);
    //newBuffer.getChannelData(1).set(buffers[1]);
    newSource.buffer = newBuffer;
    newSource.connect(audioContext.destination);
    newSource.start(0);
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

function blobToFile(blob) {
    //lol who knows but it certainly looks like a file
    var file = new File([blob], "fileGuy", {
        lastModifiedDate: new Date()
    });
    /*for (var prop in file) {
        console.log("blob:" + file + ": " + prop);
    } */
    return blob;
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
                    console.log("arraybuffer:" + arraybuffer[1]); //oh no
                    for (var prop in arraybuffer) {
                        console.log("blob: " + prop);
                    }
                    console.log("ab channel:" + buffer.getChannelData(0));
                }, function (e) {
                    "Error decoding data"
                }));
            }
        });
    });
}