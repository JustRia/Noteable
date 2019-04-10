/* Unit tests for functions within note_detection.js */

var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should;
var note_detect = require("../note-detection.js");

describe('note_detection.js combine_notes() function unit tests', function() {
    it('From an array of sampled notes, combine consecutive notes of the same note name', function() {
        var arr = [
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.5 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "D4", freq : 293.7 },
            { note_name : "E4", freq : 329.6 },
            { note_name : "E4", freq : 329.6 },
            { note_name : "E4", freq : 329.6 },
            { note_name : "E4", freq : 329.6 },
            { note_name : "E4b", freq : 311.3 },
            { note_name : "rest", freq : 0 },
            { note_name : "rest", freq : 0 },
            { note_name : "rest", freq : 0 },
        ];

        var expected = [
            { note_name_full : "C4", note : "C", octave : "4", freq : 261.6, note_length : 8 },
            { note_name_full : "E4b", note : "E", octave : "4", accidental : "b", freq : 311.3, note_length : 8 },
        ];

        var res = note_detect.combine_notes(arr);

        expect(res).to.eql(expected);
    });

    it('If the array is all one note, return should be array of size 1 with note_length == input.length', function() {
        var arr = [
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 },
            { note_name : "C4", freq : 261.6 }
        ];

        var expected = [
            { note_name_full : "C4", note : "C", octave : "4", freq : 261.6, note_length : 8 },
        ];

        var res = note_detect.combine_notes(arr);
        expect(res).to.eql(expected);
    });
});

describe('note_detection.js measures_split() function unit tests', function() {
    var beats_per_measure = 4;

    it('Function should round note lengths to the nearest multiple of 8', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 7 },
            { note_name_full : "F4", note : "F", octave : "4", note_length : 18 },
            { note_name_full : "A5", note : "A", octave : "5", note_length : 37 },
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res[0][0].note_length).to.eql(8);
        expect(res[0][1].note_length).to.eql(16);
        expect(res[0][2].note_length).to.eql(40);
    });

    it('Function should divide the array of notes into subarrays based on beats per measure', function() {
        var arr = [
            // Measure 1
            { note_name_full : "C4", note : "C", octave : "4", note_length : 15 },
            { note_name_full : "D4", note : "D", octave : "4", note_length : 18 },
            { note_name_full : "E4", note : "E", octave : "4", note_length : 30 },
            //Measure 2
            { note_name_full : "F4", note : "F", octave : "5", note_length : 30 },
            { note_name_full : "A5", note : "A", octave : "5", note_length : 32 },
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 16 },
                { note_name_full : "D4", note : "D", octave : "4", note_length : 16 },
                { note_name_full : "E4", note : "E", octave : "4", note_length : 32 },
            ],
            [
                { note_name_full : "F4", note : "F", octave : "5", note_length : 32 },
                { note_name_full : "A5", note : "A", octave : "5", note_length : 32 },
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);
        

        expect(res).to.eql(expected);
    });

    it('Append a rest to the end of the last measure if the measure is not filled', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 48 }
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
                { note_name_full : "rest", note : "rest", note_length : 16 }
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);

    });

    it('If a note goes begins in a measure but does not have space for the full note ' + 
    'split the note and put the rest in another measure', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
            { note_name_full : "G4", note : "G", octave : "4", note_length : 80 }
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
                { note_name_full : "G4", note : "G", octave : "4", note_length : 16, tied : true }
            ],
            [
                { note_name_full : "G4", note : "G", octave : "4", note_length : 64 },
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);
    });

    it('Notes longer than a measure should be split into the number of needed measures', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 160 }
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 64, tied : true },
            ],
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 64, tied : true },
            ],
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 32 },
                { note_name_full : "rest", note : "rest", note_length : 32 },
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);
    });
});

describe('note_detection.js note_types() function unit tests', function() {
    // What note type is one beat? (1 = whole, 2 = half, 4 = quarter, 8 = eigth, ...)
    // Limited to values of 2^x
    one_beat = 4;

    it('In x/4 time, should assign full notes (whole, half, quarter, etc) to lengths of (8 * 2^x)', function() {
        var arr = [
            [
                //Subarray size unimportant, checking proper note_length --> note_type conversion
                { note_name_full : "C4", note : "C", octave : "4", note_length : 8 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 16 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 32 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 64 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 128 },
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 8, note_type : ["8/16"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 16, note_type : [1] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 32, note_type : [2] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 64, note_type : [4] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 128, note_type : [4, 4] },
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);

        expect(res).to.eql(expected);
    });

    it('Should assign dotted notes appropriately', function() {
        var arr = [
            [
                //Subarray size unimportant, checking proper note_length --> note_type conversion
                { note_name_full : "C4", note : "C", octave : "4", note_length : 32 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 96 },
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 32, note_type : [2] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48, note_type : [3] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 96, note_type : [4, 2] },
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);

        expect(res).to.eql(expected);
    });

    it('For notes longer than a whole note, should tie notes with whole notes as the largest', function() {
        var arr = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 280 }
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 280, note_type : [4, 4, 4, 4, "24/16"] }
            ]
        ]

        var res = note_detect.note_types(arr, one_beat);

        expect(res).to.eql(expected);
    });

    it('Should tie notes appropriately', function() {
        var arr = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 40 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 24 }
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 40, note_type : [2, "8/16"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 24, note_type : ["24/16"] }
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);
        
        expect(res).to.eql(expected);
    });

    it ('Should divide into powers of 2 for differing time signature (x/16)', function() {
        one_beat = 16;

        var arr = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 208 }
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 208, note_type : [8, 4, 1] }
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);
        
        expect(res).to.eql(expected);
    })

    it ('Should divide into powers of 2 for differing time signature (x/8)', function() {
        one_beat = 8;

        var arr = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 112 }
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 112, note_type : [4, 3] }
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);
        
        expect(res).to.eql(expected);
    });
});