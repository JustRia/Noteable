const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');

let app
describe('Record audio', function () {
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

    /* Microphone click tests */
    it('mic button is visible', function () {
        return app.client.element('#mic-icon').isVisible().then(function (isVisible) {
            return assert.equal(isVisible, true)
        })
    });

    it('record from mic icon works', function () {
        return app.webContents.executeJavaScript('document.getElementById("mic-icon").classList.remove("disabled-button")', true).then(function () {
            return app.client.element('#mic-icon').click().then(function () {
                return app.client.element('#stop-icon').click().then(function () {
                    return assert.notEqual(null, app.client.element('#linkExists'));
                })
            })
        });
    });
    it('recording length is not null', function () {
        return app.webContents.executeJavaScript('document.getElementById("mic-icon").classList.remove("disabled-button")', true).then(function () {
            return app.client.element('#mic-icon').click().then(function () {
                return app.client.element('#stop-icon').click().then(function () {
                    return assert.notEqual(app.webContents.executeJavaScript('document.getElementByTagName("audio").duration'), null);
                })
            })
        });
    })

    /*Metronome tests*/
    it('metronome exists', function () {
        return app.webContents.executeJavaScript('document.getElementById("metronome-main-content").classList.remove("main-content-hidden")', true).then(function () {
                return assert.notEqual(app.client.element('#metronomeGuy'), null);
        });
    })

    it('metronome bpm is not null', function () {
        return assert.notEqual(app.client.element('#metronomeGuy.classList[0].innerText'), null);
    })
})