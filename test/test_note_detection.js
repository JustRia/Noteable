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
