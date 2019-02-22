const Application = require('spectron').Application;
const assert = require('assert');
const electronPath = require('electron'); // Require Electron from the binaries included in node_modules.
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('Tempo Detection', function () {
    this.timeout(10000)

    beforeEach(function () {
        app = new Application({
            // Your electron path can be any binary
            // i.e for OSX an example path could be '/Applications/MyApp.app/Contents/MacOS/MyApp'
            // But for the sake of the example we fetch it from our node_modules.
            path: electronPath,

            // Assuming you have the following directory structure

            //  |__ my project
            //     |__ ...
            //     |__ main.js
            //     |__ package.json
            //     |__ index.html
            //     |__ ...
            //     |__ test
            //        |__ spec.js  <- You are here! ~ Well you should be.

            // The following line tells spectron to look and use the main.js file
            // and the package.json located 1 level above.
            args: [path.join(__dirname, '..')]
        })
        return app.start();
    });

    afterEach(function () {
        if (app && app.isRunning()) {
            return app.stop()
        }
    });

    describe('Detect tempo button', function () {
        it('should be hidden', () => {
            return app.client.element('#detect-tempo-button').isVisible().then((isVisible) => {
                assert.equal(isVisible, false);
            });
        });

        it('should display after clicking tempo button', () => {
            return app.client.element('#tempo-button').click().then(() => {
                return app.client.element('#detect-tempo-button').isVisible().then((isVisible) => {
                    assert.equal(isVisible, true);
                });
            });
        });
    });

    describe('Tapping prompt', function () {
        it('should be hidden', () => {
            return app.client.element('#detecting-tempo-div').isVisible().then((isVisible) => {
                assert.equal(isVisible, false);
            });
        });

        it('should display after clicking detect tempo button', () => {
            return app.client.element('#tempo-button').click().then(() => {
                return app.client.element('#detect-tempo-button').click().then(() => {
                    return app.client.element('#detecting-tempo-div').isVisible().then((isVisible) => {
                        assert.equal(isVisible, true);
                    });
                });
            });
        });

        it('should start at 10', () => {
            return app.client.element('#tempo-button').click().then(() => {
                return app.client.element('#detect-tempo-button').click().then(() => {
                    return app.client.getText('#detecting-tempo-div').then((text) => {
                        chai.assert.include(text, '10');
                    });
                });
            });
        });

        it('should decrement when spacebar is pressed', () => {
            app.client.element('#tempo-button').click().then(() => {
                app.client.element('#detect-tempo-button').click().then(() => {
                        var text = app.webContents.sendInputEvent({ type: 'keyDown', keyCode: ' ' }).getText('#detecting-tempo-div');
                        return chai.assert.eventually.include(text, '9');
                });
            });
        });
    });
});
