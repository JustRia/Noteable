var ABCJS = require('abcjs');

function testRenderSheetMusic() {
    time_signature_top_num_input = 4;
    time_signature_bottom_num_input = 4;
    key_signature_input = 'C';
    var testArray = [
        [
            { note_name_full : "c4", note : "c", octave : "4", accidental : undefined, freq : 0, note_length : 1 },
            { note_name_full : "d4", note : "d", octave : "4", accidental : undefined, freq : 0, note_length : 1 },
            { note_name_full : "e4", note : "e", octave : "4", accidental : undefined, freq : 0, note_length : 2 },
        ],
        [
            { note_name_full : "e4b", note : "e", octave : "4", accidental : "b", freq : 0, note_length : 1 },
            { note_name_full : "rest", note : "rest", freq : 0, note_length : 3 }
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
        for (var j = 0; j < input[i].length; j++) {
            if (input[i][j].note == "rest") {
                output += "z"
                output += input[i][j].note_length; // TODO: change I believe
            } else {
                if (input[i][j].accidental == "b") {
                    output += "_";
                } else if (input[i][j].accidental == "#") {
                    output += "^";
                }
                output += input[i][j].note;
                output += input[i][j].note_length; // TODO: change I believe
            }
        }
        if (i != input.length - 1) {
            output += "|"; // start a new measure only if not at the end
        }
        if ((i + 1) % 4 == 0) {
            output += "\n"; // start a new line every 4 measures.
        }
    }
    output += ":|";

    console.log(output);
    ABCJS.renderAbc("sheet-music", output); // attaches var abc to DOM element id="sheet-music"
}
