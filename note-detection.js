const Pitchfinder = require("pitchfinder");
const teoria = require("teoria");

const samples_per_beat = 32;

const fraction_of_beat = {
    8 : [4, ""],
    16 : [2, ""],
    24 : [2, "."],
}

module.exports = {
    get_notes : function(buffer, time_signature, tempo) {// see below for optional constructor parameters.

        time_signature = "4/4";
        const detectPitch = new Pitchfinder.AMDF();

        /*const decoded = WavDecoder.decode.sync(buffer); // get audio data from file using `wav-decoder`
        const float32Array = decoded.channelData[0]; // get a single channel of sound*/

        const float32Array = buffer.getChannelData(0);

        var frequencies = Pitchfinder.frequencies(detectPitch, float32Array, {
            tempo: tempo, // in BPM, defaults to 120
            quantization: samples_per_beat, // samples per beat, defaults to 4 (i.e. 16th notes)
                         // We assume users will not sing any faster than quarter beats
        });

        var notes = frequencies.map(freq => freq < 1109 && freq != null ? 
                                {
                                    "freq" : freq, 
                                    "note_name" : "" + teoria.note.fromFrequency(freq).note.name().toUpperCase()
                                                + teoria.note.fromFrequency(freq).note.octave()
                                                + teoria.note.fromFrequency(freq).note.accidental(),
                                } : {"freq" : null, "note_name" : "rest"});
        console.log(notes);
        
        var combined = combine_notes(notes);
        console.log('Notes combined based on consecutive samples of the same note', combined);
        
        var beats_per_measure = time_signature.split("/")[0];
        var one_beat = time_signature.split("/")[1];
    
        var measures = measures_split(combined, beats_per_measure);
        console.log('Notes divided into subarrays by measures', measures);

        /*measures = note_types(measures, one_beat);
        console.log('Measures assigned note types', measures);*/

        var new_measures = note_types(measures, one_beat);
        console.log('Notes with assigned note types', new_measures);
        

        return measures;
        
    },
    combine_notes : combine_notes,
    measures : measures_split,
    note_types : note_types

}

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
            if (note.note_name != "rest") {
                note_obj = {
                    "note_name_full" : note.note_name,
                    "note" : note.note_name.split("")[0],
                    "octave" : note.note_name.split("")[1],
                    "accidental" : note.note_name.split("")[2],
                    "freq" : note.freq,
                    "note_length" : size
                }
            } else {
                note_obj = {
                    "note_name_full" : note.note_name,
                    "note" : "rest",
                    "freq" : note.freq,
                    "note_length" : size
                }
            }
            continue;
        }
        
        // The index's note_name matches the current note being checked, increment size
        if (note.note_name == note_obj.note_name_full) {
            size++;
            note_obj.freq += note.freq;
        } else { // note_name does not match, reset note being checked and push the current note_obj
            note_obj.note_length = size;
            note_obj.freq = note_obj.freq / size;
            combined_notes.push(note_obj);
            size = 1;
            note_obj = null;
            --i;
        }
        
        if (i == notes.length - 1) {
            note_obj.note_length = size;
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
 * @param {number} combined_notes[].note_length - The number of samples a note was held (in 32 samples/beat)
 * @param {number} beats_per_measure - The number of beats per measure
 * 
 * @returns {Array} The combined_notes array, with rounded lengths and sub-arrays of measures
 * 
 */
function measures_split(combined_notes, beats_per_measure) {

    //Number of beats & samples per measure.  Needed to split array into measure
    samples_per_measure = beats_per_measure * samples_per_beat;

    measures_arr = []
    measure = []

    // Combine notes based on measure
    for (var i = 0; i < combined_notes.length; ++i) {
        note_obj = combined_notes[i];

        // Note is below the lowest threshold to be considered a 16th note (fastest note user can sing)
        if (note_obj.note_length < 5)
            continue;

        // Round length based on samples per beat (32 samples/beat --> 8 samples/16th beat)
        note_obj.note_length = 8 * Math.round(note_obj.note_length/8);

        // Add note to the current measure if enough samples remain open in the measure
        if (samples_per_measure - note_obj.note_length >= 0) {
            measure.push(note_obj);
            samples_per_measure -= note_obj.note_length;
        } else {
            /*
                If no more space remains in the measure to fit the entire note, 2 cases:
                1) If samples_per_measure > 0, there is space for a note in the measure.
                    cut the next note and put the front into the measure and the back 
                    into the next measure.
                2) samples_per_measure = 0, add full measure, then place note into the next measure(s).
            */
            cut_length = note_obj.note_length - samples_per_measure;
            front_split = JSON.parse(JSON.stringify(note_obj));
            front_split.note_length = samples_per_measure;
            // Note is tied to a note split and placed in the next measure
            front_split.tied = true;
            if (samples_per_measure > 0)
                measure.push(front_split);
            back_split = JSON.parse(JSON.stringify(note_obj));
            back_split.note_length = cut_length;
            samples_per_measure = beats_per_measure * samples_per_beat;
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
            "note_length" : 8 * Math.round(samples_per_measure/8)
        }
        measure.push(end_rest);
    }
    measures_arr.push(measure);

    return measures_arr;
}


/**
 * 
 * @param {Object[]} measures - The notes sampled from the recorded audio split into measure subarrays by beats
 * @param {number} measures[].note_length - The number of samples a note was held (in 32 samples/beat)
 * @param {number} one_beat - The note type that constitutes one beat (quarter, 8th, 16th, etc)
 * 
 * @returns {Array} The measures array, with each note assigned a note_type (whole, half, quarter, etc)
 * 
 */
function note_types(measures, one_beat) {

    var res = [];

    /*for (var i = 0; i < measures.length; ++i) {
        measure = JSON.parse(JSON.stringify(measures[i]));
        measure_updated = [];
        for (var j = 0; j < measure.length; ++j) {
            // Convert a note's sample length to a note type (half, quarter, 8th, 16th, etc)
            note_type = samples_per_beat / measure[j].note_length * one_beat;
            note_obj = JSON.parse(JSON.stringify(measure[j]));
            if (note_type % 1 == 0) {
                //Note type is a multiple of whole number (half, quarter, 8th, 16th, etc)
                note_obj.note_type = "" + note_type;
            } else {
                // Conversion does not cleanly divide into a whole number (dotted note / tied note)
                // Get number of beats a note takes up
                temp = note_obj.note_length / samples_per_beat;
                if (temp == 0.75) { //dotted half beat = 0.5 + 0.25 = 0.75
                    note_obj.note_type = 2 * one_beat + ".";
                } else if (temp == 1.25) {  //single beat + quarter beat (slurred over two notes)
                    note_obj.note_type = one_beat + "~ " + (one_beat * 4);
                } else if (temp == 1.5) { //dotted single beat = 1.5
                    note_obj.note_type = one_beat + ".";
                } else if (temp == 1.75) { //single beat + 3/4 beat (slurred over two notes)
                    note_obj.note_type = one_beat + "~ " + (2 * one_beat);
                } else if (temp > 2 && temp < 3) { // between 2 and 3 beats
                    multiplier = fraction_of_beat[note_obj.note_length % samples_per_beat];
                    note_obj.note_type = (one_beat / 2) + "~ " + (multiplier[0] * one_beat + multiplier[1]);
                } else if (temp == 3) { //dotted 2 beat = 3 beats (dotted half note)
                    note_obj.note_type = one_beat / 2 + ".";
                } else if (temp > 3 && temp < 4) { //Between a 3 beats and 4 beats
                    multiplier = fraction_of_beat[note_obj.note_length % samples_per_beat];
                    note_obj.note_type = (one_beat / 2 + ".") + "~ " + (multiplier[0] * one_beat + multiplier[1]);
                } else if (temp > 4 && temp < 5) { //between 4 and 5 beats
                    multiplier = fraction_of_beat[note_obj.note_length % samples_per_beat];
                    note_obj.note_type = (one_beat / 4) + "~ " + (multiplier[0] * one_beat + multiplier[1]);
                } else if (temp > 5 && temp < 6) { //between 5 and 6 beats
                    multiplier = fraction_of_beat[note_obj.note_length % samples_per_beat];
                    note_obj.note_type = (one_beat / 4 + "~ " + one_beat + "~ " + multiplier[0] * one_beat + multiplier[1]);
                }else { //dotted 4 beat = 6 beats
                    note_obj.note_type = one_beat / 4 + ".";
                }
            }
            measure_updated.push(note_obj);
        }
        
        res.push(measure_updated);
    }*/

    for (var i = 0; i < measures.length; ++i) {
        measure = JSON.parse(JSON.stringify(measures[i]));
        measure_updated = [];
        for (var j = 0; j < measure.length; ++j) {
            note_obj = JSON.parse(JSON.stringify(measure[j]));

            //Determine if a note was held for a full beat (32 * x length)
            temp = note_obj.note_length % samples_per_beat;
            //How many full beats was the note held
            quotient = parseInt(note_obj.note_length / samples_per_beat);

            note_obj.note_type = [];
            quotient_temp = quotient;
            //If note is held longer than a whole note lengths, split into as many tied whole notes
            //as possible
            while (quotient_temp - one_beat > 0) {
                note_obj.note_type.push(one_beat);
                quotient_temp -= one_beat;
            }

            //No remainder, this means a note was held for a full number of beats
            if (temp == 0) {
                //If the note beats are power of 2, can be represented as a single note
                if (Math.log2(quotient_temp) % 1 === 0) {
                    note_obj.note_type.push(quotient_temp);
                    measure_updated.push(note_obj);
                } else {
                    //Special case: note beats of 3 can be represented as a single note
                    if (quotient_temp == 3) {
                        note_obj.note_type.push(quotient_temp);
                        measure_updated.push(note_obj);
                    } else {
                        //Separate into largest power of 2 and what remains
                        low_pow = Math.pow(2,Math.floor(Math.log2(quotient_temp)));
                        rest = quotient_temp - low_pow;
                        note_obj.note_type.push(low_pow, rest);
                        measure_updated.push(note_obj);
                    }
                }
            } else { //There is a remainder, was not held for a whole number of beats
                if (quotient_temp > 0) { //Only do this is there's full beats not accounted for
                    //Perform same steps as above
                    if (Math.log2(quotient_temp) % 1 === 0) {
                        note_obj.note_type.push(quotient_temp);
                    } else {
                        if (quotient_temp == 3) {
                            note_obj.note_type.push(quotient_temp);
                        } else {
                            low_pow = Math.pow(2,Math.floor(Math.log2(quotient_temp)));
                            rest = quotient_temp - low_pow;
                            note_obj.note_type.push(low_pow, rest);
                        }
                    }
                }
                //Add final fractional bit to the end
                note_obj.note_type.push(temp + "/" + samples_per_beat);
                measure_updated.push(note_obj);
            }
        }
        res.push(measure_updated);
    }

    return res;

}
