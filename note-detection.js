const fs = require("fs");
const WavDecoder = require("wav-decoder");
const Pitchfinder = require("pitchfinder");
const request = require("request")

// see below for optional constructor parameters.
const detectPitch = new Pitchfinder.YIN();

const buffer = fs.readFileSync('');
const decoded = WavDecoder.decode.sync(buffer); // get audio data from file using `wav-decoder`
const float32Array = decoded.channelData[0]; // get a single channel of sound

const frequencies = Pitchfinder.notes(detectPitch, float32Array, {
    tempo: 114, // in BPM, defaults to 120
    quantization: 16, // samples per beat, defaults to 4 (i.e. 16th notes)
});
