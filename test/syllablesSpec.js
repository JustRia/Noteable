const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');
const chai = require('chai');
const words_to_syllables = require("../words-to-syllables.js");

let app

global.before(function() {
    chai.should();
})

describe('Syllables', function () {
    this.timeout(10000)

    before(function () {
        app = new Application({
            path: electronPath,
            args: [path.join(__dirname, '..')]
        })
        return app.start()
    })

    after(function () {
        if (app && app.isRunning()) {
            return app.stop()
        }
    });

    it("conundrum", function() {
        var text = "conundrum";
        var expected = ["co", "nun", "drum"];
        var res = words_to_syllables.splitWords(text);
        chai.expect(res).to.eql(expected);
    });

    it("intimidating", function() {
        var text = "intimidating";
        var expected = ["in", "ti", "mi", "da", "ting"];
        var res = words_to_syllables.splitWords(text);
        chai.expect(res).to.eql(expected);
    });

    it("The old apple revels in its authority.", function() {
        var text = "The old apple revels in its authority.";
        var expected = ["The", "old", "ap", "ple", "re", "vels", "in", "its", "au", "tho", "ri", "ty."];
        var res = words_to_syllables.splitWords(text);
        chai.expect(res).to.eql(expected);
    });

    it("Is this the real life?", function() {
        var text = "Is this the real life?";
        var expected = ["Is", "this", "the", "real", "life?"];
        var res = words_to_syllables.splitWords(text);
        chai.expect(res).to.eql(expected);
    });

    it("Is this just fantasy?", function() {
        var text = "Is this just fantasy?";
        var expected = ["Is", "this", "just", "fan", "ta", "sy?"];
        var res = words_to_syllables.splitWords(text);
        chai.expect(res).to.eql(expected);
    });
});
