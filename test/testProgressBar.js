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

describe('Progress Bar', function () {
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

    it('progress bar appears', function() {
        return app.webContents.executeJavaScript('document.getElementById("progress-bar-main-content").classList.remove("hidden")', true).then(function() {
            return app.webContents.executeJavaScript('document.getElementById("input-main-content").classList.add("hidden")', true).then(function() {
                return app.client.waitUntilWindowLoaded().element('#progress-bar').isVisible().then(function(visible) {
                    return assert.equal(visible, true);
                });
            });
        });
    });

    it('progress bar fills up and switches to sheet music view', function () {
        return app.webContents.executeJavaScript('document.getElementById("progress-bar-main-content").classList.remove("hidden")', true).then(function() {
            return app.webContents.executeJavaScript('document.getElementById("input-main-content").classList.add("hidden")', true).then(function() {
                // now the progress bar is displayed
                var runScript = 'updateProgress(\'speech-to-text\');';
                runScript += 'updateProgress(\'frequency-detection\');';
                runScript += 'updateProgress(\'note-detection\');';
                runScript += 'updateProgress(\'measure-detection\');';
                runScript += 'updateProgress(\'auto-detect-key\');';
                runScript += 'updateProgress(\'input-to-renderer\');';
                runScript += 'updateProgress(\'finished\');';

                return app.webContents.executeJavaScript(runScript, true).then(function() {
                    // wait 2 seconds to let animation run.
                    return app.client.pause(2000).then(function() {
                        return app.client.element("#sheet-music-main-content").isVisible().should.eventually.equal(true);
                    });
                });
            });
        });
    });
})
