const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

let app

global.before(function() {
    chai.should();
    chai.use(chaiAsPromised);
})

describe('Render Sheet Music', function () {
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
    })

    it('Sheet music renders correctly', function() {
        return app.webContents.executeJavaScript('document.getElementById("sheet-music-main-content").classList.remove("hidden")', true).then(function() {
            return app.webContents.executeJavaScript('document.getElementById("input-main-content").classList.add("hidden")', true).then(function() {
                var runThis =
                    "time_signature_top_num_input = 4;" +
                    "time_signature_bottom_num_input = 4;" +
                    "key_signature_input = \'C\';" +
                    "var testArray = [" +
                        "[" +
                            "{ note_name_full : \"c4\", note : \"C\", octave : \"4\", accidental : undefined, freq : 0, note_length : 32 , note_type : [\"2\", \"1/2\"]}," +
                            "{ note_name_full : \"d4\", note : \"D\", octave : \"4\", accidental : undefined, freq : 0, note_length : 32 , note_type : [\"1/2\"]}," +
                            "{ note_name_full : \"e4\", note : \"E\", octave : \"4\", accidental : undefined, freq : 0, note_length : 64 , note_type : [\"1\"], tied : true}," +
                        "]," +
                        "[" +
                            "{ note_name_full : \"e4\", note : \"E\", octave : \"4\", accidental : undefined, freq : 0, note_length : 32 , note_type : [\"1\"]}," +
                            "{ note_name_full : \"rest\", note : \"rest\", freq : 0, note_length : 96, note_type : [\"3\"] }" +
                        "]" +
                    "];" +
                    "var words = " +
                    "[[\"hel\", \"lo\"], [\"its\"], [\"me\"]]";
                return app.webContents.executeJavaScript(runThis, true).then(function() {
                    return app.webContents.executeJavaScript("renderSheetMusic(testArray, words);", true).then(function() {
                        return app.client.pause(1000).then(function() {
                            return app.client.element("#sheet-music > svg").isVisible().should.eventually.equal(true);
                        });
                    });
                });

            });
        });
    });
});
