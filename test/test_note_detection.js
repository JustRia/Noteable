/* Unit tests for functions within note_detection.js */

var assert = require("assert");
var expect = require("chai").expect;
var should = require("chai").should;
var note_detect = require("../note-detection.js");

describe('note_detection.js combine_notes() function unit tests', function() {
    it('From an array of sampled notes, combine consecutive notes of the same note name', function() {
        var arr = [
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 },
            { note_name : "d4", freq : 0 },
            { note_name : "e4", freq : 0 },
            { note_name : "e4", freq : 0 },
            { note_name : "e4", freq : 0 },
            { note_name : "e4b", freq : 0 },
            { note_name : "rest", freq : 0 },
            { note_name : "rest", freq : 0 },
            { note_name : "rest", freq : 0 },
        ];

        var expected = [
            { note_name_full : "c4", note : "c", octave : "4", accidental : undefined, freq : 0, note_length : 2 },
            { note_name_full : "d4", note : "d", octave : "4", accidental : undefined, freq : 0, note_length : 1 },
            { note_name_full : "e4", note : "e", octave : "4", accidental : undefined, freq : 0, note_length : 3 },
            { note_name_full : "e4b", note : "e", octave : "4", accidental : "b", freq : 0, note_length : 1 },
            { note_name_full : "rest", note : "rest", freq : 0, note_length : 3 },
        ];

        var res = note_detect.combine_notes(arr);

        expect(res).to.eql(expected);
    });

    it('If the array is all one note, return should be array of size 1 with note_length == input.length', function() {
        var arr = [
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 },
            { note_name : "c4", freq : 0 }
        ];

        var expected = [
            { note_name_full : "c4", note : "c", octave : "4", accidental : undefined, freq : 0, note_length : 7 },
        ];

        var res = note_detect.combine_notes(arr);
        expect(res).to.eql(expected);
    });
});

describe('note_detection.js measures_split() function unit tests', function() {
    var beats_per_measure = 4;

    it('Function should round note lengths to the nearest multiple of 8', function() {
        var arr = [
            { note_name_full : "c4", note : "c", octave : "4", note_length : 7 },
            { note_name_full : "f4", note : "f", octave : "4", note_length : 18 },
            { note_name_full : "a5", note : "a", octave : "5", note_length : 84 },
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res[0][0].note_length).to.eql(8);
        expect(res[0][1].note_length).to.eql(16);
        expect(res[0][2].note_length).to.eql(88);
    });

    it('Function should filter out note lengths below the lowest note threshold of 8 after rounding', function() {
        var arr = [
            { note_name_full : "c4", note : "c", octave : "4", note_length : 4 },
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        //Should remove the c4 note since it's less than 8 when rounded
        expect(res[0][0].note_name_full).to.not.eql("c4");
    });

    it('Function should divide the array of notes into subarrays based on beats per measure', function() {
        var arr = [
            // Measure 1
            { note_name_full : "c4", note : "c", octave : "4", note_length : 23 },
            { note_name_full : "d4", note : "d", octave : "4", note_length : 18 },
            { note_name_full : "e4", note : "e", octave : "4", note_length : 84 },
            //Measure 2
            { note_name_full : "f4", note : "f", octave : "5", note_length : 30 },
            { note_name_full : "g4", note : "g", octave : "5", note_length : 61 },
            { note_name_full : "a5", note : "a", octave : "5", note_length : 32 },
        ];

        var expected = [
            [
                { note_name_full : "c4", note : "c", octave : "4", note_length : 24 },
                { note_name_full : "d4", note : "d", octave : "4", note_length : 16 },
                { note_name_full : "e4", note : "e", octave : "4", note_length : 88 },
            ],
            [
                { note_name_full : "f4", note : "f", octave : "5", note_length : 32 },
                { note_name_full : "g4", note : "g", octave : "5", note_length : 64 },
                { note_name_full : "a5", note : "a", octave : "5", note_length : 32 },
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);
        

        expect(res).to.eql(expected);
    });

    it('Append a rest to the end of the last measure if the measure is not filled', function() {
        var arr = [
            { note_name_full : "c4", note : "c", octave : "4", note_length : 48 }
        ];

        var expected = [
            [
                { note_name_full : "c4", note : "c", octave : "4", note_length : 48 },
                { note_name_full : "rest", note : "rest", note_length : 80 }
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);

    });

    it('If a note goes begins in a measure but does not have space for the full note ' + 
    'split the note and put the rest in another measure', function() {
        var arr = [
            { note_name_full : "c4", note : "c", octave : "4", note_length : 48 },
            { note_name_full : "g4", note : "g", octave : "4", note_length : 128 }
        ];

        var expected = [
            [
                { note_name_full : "c4", note : "c", octave : "4", note_length : 48 },
                { note_name_full : "g4", note : "g", octave : "4", note_length : 80 }
            ],
            [
                { note_name_full : "g4", note : "g", octave : "4", note_length : 48 },
                { note_name_full : "rest", note : "rest", note_length : 80 }
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);
    });

    it('Notes longer than a measure should be split into the number of needed measures', function() {
        var arr = [
            { note_name_full : "c4", note : "c", octave : "4", note_length : 320 }
        ];

        var expected = [
            [
                { note_name_full : "c4", note : "c", octave : "4", note_length : 128 },
            ],
            [
                { note_name_full : "c4", note : "c", octave : "4", note_length : 128 },
            ],
            [
                { note_name_full : "c4", note : "c", octave : "4", note_length : 64 },
                { note_name_full : "rest", note : "rest", note_length : 64 },
            ]
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        expect(res).to.eql(expected);
    });

});