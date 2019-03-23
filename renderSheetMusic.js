var ABCJS = require('abcjs');

function testRenderSheetMusic() {
    document.getElementById("sheet-music-main-content").classList.remove("hidden");
    document.getElementById("input-main-content").classList.add("hidden");
    time_signature_top_num_input = 4;
    time_signature_bottom_num_input = 4;
    key_signature_input = 'C';
    var testArray = [
        [
            { note_name_full : "C4", note : "C", octave : "4", accidental : undefined, freq : 0, note_length : 32 , note_type : ["2", "1/2"]},
            { note_name_full : "C4#", note : "C", octave : "4", accidental : "#", freq : 0, note_length : 32 , note_type : ["1/2"]},
            { note_name_full : "C4#", note : "C", octave : "4", accidental : "#", freq : 0, note_length : 32 , note_type : ["1/2"]},
            { note_name_full : "E4", note : "E", octave : "4", accidental : undefined, freq : 0, note_length : 64 , note_type : ["1"], tied : true},
        ],
        [
            { note_name_full : "C4", note : "E", octave : "4", accidental : undefined, freq : 0, note_length : 32 , note_type : ["1"]},
            { note_name_full : "rest", note : "rest", freq : 0, note_length : 96, note_type : ["3"] }
        ]
    ];
    renderSheetMusic(testArray);
}

/*
 * Special characters to take note of:
 * ' (single quote): octave up
 * , (comma): ocatave down
 * ^ (carrot): sharp sign
 * _ (underscore): flat sign
 * = (equals): natural sign
 * - (hiphen): tie between A1_B1
 * z: rest
 */

function renderSheetMusic(input) {
    var output; // will hold final abcjs format for sheet music
    output = "M: " + time_signature_top_num_input + "/" + time_signature_bottom_num_input + "\n";
    output += "L: 1/" + time_signature_bottom_num_input + "\n";
    output += "K: " + key_signature_input + "\n";
    output += "|:";
    // one measure at a time
    for (var i = 0; i < input.length; i++) {
        var measureAccidentals = []; // keep track of accidentals in the measure
        // one note at a time
        for (var j = 0; j < input[i].length; j++) {
            if (input[i][j].note == "rest") {
                output += "z";
                for (var k = 0; k < input[i][j].note_type.length; k++) {
                    output += input[i][j].note_type[k];
                    // if there is more than 1 note:
                    if (k != input[i][j].note_type.length - 1) {
                        output += "-"; // add tie
                    }
                }
            } else {
                // add note, and possible tie between notes
                for (var k = 0; k < input[i][j].note_type.length; k++) {
                    if (input[i][j].accidental == "b") {
                        // check to see if we insert the accidental or not
                        if (!measureAccidentals.includes(input[i][j].note_name_full)) {
                            output += "_";
                            measureAccidentals.push(input[i][j].note_name_full);
                            // remove sharp from measureAccidentals
                            if (measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "#") >= 0) {
                                var index = measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "#");
                                measureAccidentals.splice(index, 1);
                            }
                        }
                    } else if (input[i][j].accidental == "#") {
                        // check to see if we insert the accidental or not
                        if (!measureAccidentals.includes(input[i][j].note_name_full)) {
                            output += "^";
                            measureAccidentals.push(input[i][j].note_name_full);
                            // remove flat from measureAccidentals
                            if (measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "b") >= 0) {
                                var index = measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "b");
                                measureAccidentals.splice(index, 1);
                            }
                        }
                    } else {
                        // possibly add natural sign since neither sharp nor flat
                        if (measureAccidentals.includes(input[i][j].note_name_full + "#") || measureAccidentals.includes(input[i][j].note_name_full + "b")) {
                            output += "=";
                            // remove flat from measureAccidentals
                            if (measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "b") >= 0) {
                                var index = measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "b");
                                measureAccidentals.splice(index, 1);
                            }
                            // remove sharp from measureAccidentals
                            if (measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "#") >= 0) {
                                var index = measureAccidentals.indexOf(input[i][j].note + input[i][j].octave + "#");
                                measureAccidentals.splice(index, 1);
                            }
                        }
                    }
                    // add note name
                    output += input[i][j].note;
                    // handle octave
                    if (input[i][j].octave < 4) {
                        var currentOctave = input[i][j].octave;
                        while (currentOctave < 4) {
                            output += ",";
                            currentOctave++;
                        }
                    } else {
                        var currentOctave = input[i][j].octave;
                        while (currentOctave > 4) {
                            output += "\'";
                            currentOctave--;
                        }
                    }
                    // add length for note
                    output += input[i][j].note_type[k];
                    // possibly add the tie
                    if (k != input[i][j].note_type.length - 1) {
                        output += "-"; // add tie
                    }
                }
            }
            if (input[i][j].hasOwnProperty('tied')) {
                if (input[i][j].tied == true) {
                    output += "-"
                }
            }
        }
        // possibly start a new measure
        if (i != input.length - 1) {
            output += "|"; // start a new measure only if not at the end
            if ((i + 1) % 4 == 0) {
                output += "\n"; // start a new line every 4 measures.
            }
        }
    }
    output += ":|";

    console.log(output);
    ABCJS.renderAbc("sheet-music", output); // attaches var abc to DOM element id="sheet-music"
}

function getKeyAccidentals() {
    var ret = [];
    switch (key_signature_input) {
        case "A-flat":
            ret = ["Bb", "Eb", "Ab", "Db"];
            break;
        case "A":
            ret = ["F#", "C#", "G#"];
            break;
        case "A-sharp":
            ret = []; // TODO: REMOVE from options
            break;
        case "B-flat":
            ret = ["Bb", "Eb"];
            break;
        case "B":
            ret = ["F#", "C#", "G#", "D#", "A#"];
            break;
        case "C":
            ret = [];
            break;
        case "C-sharp":
            ret = ["F#", "C#", "G#", "D#", "A#", "E#", "B#"];
            break;
        case "D-flat":
            ret = ["Bb", "Eb", "Ab", "Db", "Gb"];
            break;
        case "D":
            ret = ["F#", "C#"];
            break;
        case "D-sharp":
            ret = []; // TODO: remove from options
            break;
        case "E-flat":
            ret = ["Bb", "Eb", "Ab"];
            break;
        case "E":
            ret = ["F#", "C#", "G#", "D#"];
            break;
        case "F":
            ret = ["Bb"];
            break;
        case "F-sharp":
            ret = ["F#", "C#", "G#", "D#", "A#", "E#"];
            break;
        case "G-flat":
            ret = ["Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
            break;
        case "G":
            ret = ["F#"];
            break;
        case "G-sharp":
            ret = []; // TODO: REMOVE from options
            break;
    }
    console.log("accidentals in the key " + key_signature_input + " are " + ret);
    return ret;
}
