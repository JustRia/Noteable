/* Unit tests for functions within note_detection.js */

var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should;
var note_detect = require("../note-detection.js");

describe('note_detection.js combine_notes() function unit tests', function() {
    it('From an array of sampled notes, combine consecutive notes of the same note name', function() {
        var arr = [
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "D4", freq : 0 },
            { note_name : "E4", freq : 0 },
            { note_name : "E4", freq : 0 },
            { note_name : "E4", freq : 0 },
            { note_name : "E4", freq : 0 },
            { note_name : "E4b", freq : 0 },
            { note_name : "rest", freq : 0 },
            { note_name : "rest", freq : 0 },
            { note_name : "rest", freq : 0 },
        ];

        var expected = [
            { note_name_full : "C4", note : "C", octave : "4", accidental : undefined, freq : 0, note_length : 5 },
            { note_name_full : "D4", note : "D", octave : "4", accidental : undefined, freq : 0, note_length : 1 },
            { note_name_full : "E4", note : "E", octave : "4", accidental : undefined, freq : 0, note_length : 4 },
            { note_name_full : "E4b", note : "E", octave : "4", accidental : "b", freq : 0, note_length : 1 },
            { note_name_full : "rest", note : "rest", freq : 0, note_length : 3 },
        ];

        var res = note_detect.combine_notes(arr);

        expect(res).to.eql(expected);
    });

    it('If the array is all one note, return should be array of size 1 with note_length == input.length', function() {
        var arr = [
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 },
            { note_name : "C4", freq : 0 }
        ];

        var expected = [
            { note_name_full : "C4", note : "C", octave : "4", accidental : undefined, freq : 0, note_length : 7 },
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
            { note_name_full : "A5", note : "A", octave : "5", note_length : 84 },
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res[0][0].note_length).to.eql(8);
        expect(res[0][1].note_length).to.eql(16);
        expect(res[0][2].note_length).to.eql(88);
    });

    it('Function should filter out note lengths below the lowest note threshold of 8 after rounding', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 4 },
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        //Should remove the c4 note since it's less than 8 when rounded
        expect(res[0][0].note_name_full).to.not.eql("C4");
    });

    it('Function should divide the array of notes into subarrays based on beats per measure', function() {
        var arr = [
            // Measure 1
            { note_name_full : "C4", note : "C", octave : "4", note_length : 23 },
            { note_name_full : "D4", note : "D", octave : "4", note_length : 18 },
            { note_name_full : "E4", note : "E", octave : "4", note_length : 84 },
            //Measure 2
            { note_name_full : "F4", note : "F", octave : "5", note_length : 30 },
            { note_name_full : "G4", note : "G", octave : "5", note_length : 61 },
            { note_name_full : "A5", note : "A", octave : "5", note_length : 32 },
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 24 },
                { note_name_full : "D4", note : "D", octave : "4", note_length : 16 },
                { note_name_full : "E4", note : "E", octave : "4", note_length : 88 },
            ],
            [
                { note_name_full : "F4", note : "F", octave : "5", note_length : 32 },
                { note_name_full : "G4", note : "G", octave : "5", note_length : 64 },
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
                { note_name_full : "rest", note : "rest", note_length : 80 }
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);

    });

    it('If a note goes begins in a measure but does not have space for the full note ' + 
    'split the note and put the rest in another measure', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
            { note_name_full : "G4", note : "G", octave : "4", note_length : 128 }
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
                { note_name_full : "G4", note : "G", octave : "4", note_length : 80, tied : true }
            ],
            [
                { note_name_full : "G4", note : "G", octave : "4", note_length : 48 },
                { note_name_full : "rest", note : "rest", note_length : 80 }
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);
    });

    it('Notes longer than a measure should be split into the number of needed measures', function() {
        var arr = [
            { note_name_full : "C4", note : "C", octave : "4", note_length : 320 }
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 128, tied : true },
            ],
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 128, tied : true },
            ],
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 64 },
                { note_name_full : "rest", note : "rest", note_length : 64 },
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
                { note_name_full : "C4", note : "C", octave : "4", note_length : 8, note_type : ["8/32"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 16, note_type : ["16/32"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 32, note_type : [1] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 64, note_type : [2] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 128, note_type : [4] },
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);

        expect(res).to.eql(expected);
    });

    it('Should assign dotted notes appropriately', function() {
        var arr = [
            [
                //Subarray size unimportant, checking proper note_length --> note_type conversion
                { note_name_full : "C4", note : "C", octave : "4", note_length : 24 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 96 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 192 },
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 24, note_type : ["24/32"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 48, note_type : [1, "16/32"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 96, note_type : [3] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 192, note_type : [4, 2] },
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);

        expect(res).to.eql(expected);
    });

    it('For notes longer than a whole note, should tie notes with whole notes as the largest', function() {
        var arr = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 560 }
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 560, note_type : [4, 4, 4, 4, 1, "16/32"] }
            ]
        ]

        var res = note_detect.note_types(arr, one_beat);

        expect(res).to.eql(expected);
    });

    it('Should tie notes appropriately', function() {
        var arr = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 112 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 56 },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 80 }
            ]
        ];

        var expected = [
            [
                { note_name_full : "C4", note : "C", octave : "4", note_length : 112, note_type : [3, "16/32"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 56, note_type : [1, "24/32"] },
                { note_name_full : "C4", note : "C", octave : "4", note_length : 80, note_type : [2, "16/32"] }
            ]
        ];

        var res = note_detect.note_types(arr, one_beat);
        
        expect(res).to.eql(expected);
    });
});