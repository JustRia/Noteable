const fs = require("fs");
const WavDecoder = require("wav-decoder");
const Pitchfinder = require("pitchfinder");
const teoria = require("teoria")

// see below for optional constructor parameters.
const detectPitch = new Pitchfinder.YIN();

const buffer = fs.readFileSync('4-c-notes.wav');
const decoded = WavDecoder.decode.sync(buffer); // get audio data from file using `wav-decoder`
const float32Array = decoded.channelData[0]; // get a single channel of sound

var frequencies = Pitchfinder.frequencies(detectPitch, float32Array, {
    tempo: 80, // in BPM, defaults to 120
    quantization: 16, // samples per beat, defaults to 4 (i.e. 16th notes)
                     // We assume users will not sing any faster than 16th notes
});

console.log(frequencies);

var notes = frequencies.map(freq => freq < 1109 ? {"freq" : freq, "note_name" : "" + teoria.note.fromFrequency(freq).note.name() 
                            + teoria.note.fromFrequency(freq).note.accidental()
                            + teoria.note.fromFrequency(freq).note.octave()} : null);

console.log(notes);
