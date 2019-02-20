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
    it('Function should round note lengths to the nearest multiple of 8', function() {
        var beats_per_measure = 4;
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
        var beats_per_measure = 4;
        var arr = [
            { note_name_full : "c4", note : "c", octave : "4", note_length : 4 },
        ];

        var res = note_detect.measures(arr, beats_per_measure);

        //Should remove the c4 note since it's less than 8 when rounded
        expect(res[0][0].note_name_full).to.not.eql("c4");
    });
});