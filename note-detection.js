const fs = require("fs");
const WavDecoder = require("wav-decoder");
const Pitchfinder = require("pitchfinder");
const teoria = require("teoria")

//module.exports = function(blob) {// see below for optional constructor parameters.

    time_signature = "4/4"
    const detectPitch = new Pitchfinder.YIN();

    const buffer = fs.readFileSync('');
    const decoded = WavDecoder.decode.sync(buffer); // get audio data from file using `wav-decoder`
    const float32Array = decoded.channelData[0]; // get a single channel of sound

    var frequencies = Pitchfinder.frequencies(detectPitch, float32Array, {
        tempo: 80, // in BPM, defaults to 120
        quantization: 32, // samples per beat, defaults to 4 (i.e. 16th notes)
                     // We assume users will not sing any faster than 16th notes
    });

    var notes = frequencies.map(freq => freq < 1109 && freq != null ? 
                            {"freq" : freq, "note_name" : "" + teoria.note.fromFrequency(freq).note.name() 
                            + teoria.note.fromFrequency(freq).note.octave()
                            + teoria.note.fromFrequency(freq).note.accidental()} : {"freq" : null, "note_name" : "rest"});

    console.log(notes);

    var combined = combine_notes(notes);
    console.log(combined);
    
    combined = measures_split(combined, time_signature);
    console.log(combined);


//}

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
                "note_name_full" : note.note_name,
                "note" : note.note_name != "rest" ? note.note_name.split("")[0] : "rest",
                "octave" : note.note_name != "rest" ? note.note_name.split("")[1] : undefined,
                "accidental" : note.note_name != "rest" ? note.note_name.split("")[2] : undefined,
                "freq" : note.freq,
                "length" : size
            }
            continue;
        }
        
        // The index's note_name matches the current note being checked, increment size
        if (note.note_name == note_obj.note_name_full) {
            size++;
            note_obj.freq += note.freq;
        } else { // note_name does not match, reset note being checked and push the current note_obj
            note_obj.length = size;
            note_obj.freq = note_obj.freq / size;
            combined_notes.push(note_obj);
            size = 1;
            note_obj = null;
            --i;
        }
        
        if (i == notes.length - 1) {
            note_obj.length = size;
            note_obj.freq = note_obj.freq / size;
            combined_notes.push(note_obj);
        }

    }
    return combined_notes;
}


/**
 * 
 * @param {Object[]} combined_notes - The notes sampled from the recorded audio and the length they were played
 * @param {number} combined_notes[].freq - The frequency of the note in Hz
 * @param {string} combined_notes[].note_name - The name of the note (ex. c4, f#5)
 * @param {number} combined_notes[].length - The length a note was held (in 32nd notes)
 * @param {string} time_signature - The number of beats per measure, and the note that is one beat (ex. 4/4)
 * 
 * @returns {Array} The combined_notes array, with rounded lengths and sub-arrays of measures
 * 
 */
function measures_split (combined_notes, time_signature) {

    //Number of beats & samples per measure.  Needed to split array into measures
    beats_per_measure = time_signature.split("/")[0];
    samples_per_measure = beats_per_measure * 32;

    measures_arr = []
    measure = []

    // Combine notes based on measure
    for (var i = 0; i < combined_notes.length; ++i) {
        note_obj = combined_notes[i];

        // Note is below the lowest threshold to be considered a 16th note (fastest note user can sing)
        if (note_obj.length < 5)
            continue;

        // Round length based on samples per beat (32 samples/beat --> 8 samples/16th beat)
        note_obj.length = 8 * Math.round(note_obj.length/8);

        // Add note to the current measure if enough samples remain open in the measure
        if (samples_per_measure - note_obj.length >= 0) {
            measure.push(note_obj);
            samples_per_measure -= note_obj.length;
        } else {
            /*
                If no more space remains in the measure to fit the entire note, 2 cases:
                1) If samples_per_measure > 0, there is space for a note in the measure.
                    cut the next note and put the front into the measure and the back 
                    into the next measure.
                2) samples_per_measure = 0, add full measure, then place note into the next measure(s).
            */
            cut_length = note_obj.length - samples_per_measure;
            front_split = JSON.parse(JSON.stringify(note_obj));
            front_split.length = samples_per_measure;
            if (samples_per_measure > 0)
                measure.push(front_split);
            back_split = JSON.parse(JSON.stringify(note_obj));
            back_split.length = cut_length;
            samples_per_measure = beats_per_measure * 32;
            measures_arr.push(measure);
            measure = [];
            // Add back split of note to array to be evealuated next
            combined_notes.splice(i+1, 0, back_split);
        }
    }
    
    if (samples_per_measure > 4) {
        end_rest = {
            "note_name_full" : "rest",
            "note" : "rest",
            "octave" : undefined,
            "accidental" : undefined,
            "freq" : 0,
            "length" : 8 * Math.round(samples_per_measure/8)
        }
        measure.push(end_rest);
    }
    measures_arr.push(measure);

    return measures_arr;
}
