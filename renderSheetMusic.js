var ABCJS = require('abcjs');

function testRenderSheetMusic() {
    time_signature_top_num_input = 4;
    time_signature_bottom_num_input = 4;
    key_signature_input = 'C';
    var testArray = [
        [
            { note_name_full : "c4", note : "C", octave : "2", accidental : undefined, freq : 0, note_length : 32 , note_type : ["2", "1/2"]},
            { note_name_full : "d4", note : "D", octave : "4", accidental : undefined, freq : 0, note_length : 32 , note_type : ["1/2"]},
            { note_name_full : "e4", note : "E", octave : "4", accidental : undefined, freq : 0, note_length : 64 , note_type : ["1"], tied : true},
        ],
        [
            { note_name_full : "e4", note : "E", octave : "4", accidental : undefined, freq : 0, note_length : 32 , note_type : ["1"]},
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
                        output += "_";
                    } else if (input[i][j].accidental == "#") {
                        output += "^";
                    }
                    // add note
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
