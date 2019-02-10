const fs = require("fs");
const WavDecoder = require("wav-decoder");
const Pitchfinder = require("pitchfinder");
const teoria = require("teoria")

// see below for optional constructor parameters.
const detectPitch = new Pitchfinder.YIN();

const buffer = fs.readFileSync('');
const decoded = WavDecoder.decode.sync(buffer); // get audio data from file using `wav-decoder`
const float32Array = decoded.channelData[0]; // get a single channel of sound

var frequencies = Pitchfinder.frequencies(detectPitch, float32Array, {
    tempo: 80, // in BPM, defaults to 120
    quantization: 16, // samples per beat, defaults to 4 (i.e. 16th notes)
                     // We assume users will not sing any faster than 16th notes
});

var notes = frequencies.map(freq => freq < 1109 && freq != null ? 
                            {"freq" : freq, "note_name" : "" + teoria.note.fromFrequency(freq).note.name() 
                            + teoria.note.fromFrequency(freq).note.accidental()
                            + teoria.note.fromFrequency(freq).note.octave()} : {"freq" : null, "note_name" : "rest"});

console.log(notes);

var combined = combine_notes(notes);

console.log(combined);

/**
 * 
 * @param {Object[]} notes - The notes sampled from the recorded audio
 * @param {number} notes[].freq - The frequency of the note in Hz
 * @param {string} notes[].note_name - The name of the note (ex. c4, f#5)
 * 
 * @returns {Array} An array containing the note_name and the number of consecutive sampled frequencies
 *                  with the same note_name
 * 
 */
function combine_notes(notes) {
    var size = 1;
    var combined_notes = [];
    var note_obj = null;

    // Iterating through the sampled audio
    for (var i = 0; i < notes.length; ++i) {
        note = notes[i];

        /* If the index is 0, or the counter for consecutive notes has been reset, create
        a new note object from the current index to begin comparing subsequent elements */
        if (note_obj == null) {
            note_obj = {
                "note_name" : note.note_name,
                "freq" : note.freq,
                "length" : size
            }
            continue;
        }
        
        // The index's note_name matches the current note being checked, increment size
        if (note.note_name == note_obj.note_name) {
            size++;
            note_obj.freq += note.freq;
            continue;
        } else { // note_name does not match, reset note being checked and push the current note_obj
            note_obj.freq = size;
            note_obj.freq = note_obj.freq / size;
            combined_notes.push(note_obj);
            size = 1;
            note_obj = null;
            --i;
        }
    }
    return combined_notes;
}