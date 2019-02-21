const Application = require('spectron').Application
const assert = require('assert')
const electronPath = require('electron') // Require Electron from the binaries included in node_modules.
const path = require('path')
let app



describe('Click the 3 buttons', function () {
  this.timeout(10000)

  before(function() {
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
    return app.start()
  })

  after(function() {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  beforeEach(function () {
    // run before each "it" function
    // do nothing since we leave the app open
  })

  afterEach(function () {
    // run after each "it" function
    // do nothing since we leave the app open
  })

  /* Key Signature click tests */
  it('key signature appears on click', function () {
    return app.client.element('#key-signature-button').click().then(function() {
      return app.client.element('#key-signature-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, true)
      })
    })
  })

  it('tempo does not appear on key sig click', function () {
    return app.client.element('#key-signature-button').click().then(function() {
      return app.client.element('#tempo-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, false)
      })
    })
  })

  it('time signature does not appear on key sig click', function () {
    return app.client.element('#key-signature-button').click().then(function() {
      return app.client.element('#time-signature-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, false)
      })
    })
  })

  /* Tempo Click tests */
  it('Tempo appears on click', function () {
    return app.client.element('#tempo-button').click().then(function() {
      return app.client.element('#tempo-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, true)
      })
    })
  })

  it('Key signature does not appear on tempo click', function () {
    return app.client.element('#tempo-button').click().then(function() {
      return app.client.element('#key-signature-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, false)
      })
    })
  })

  it('time signature does not appear on tempo click', function () {
    return app.client.element('#tempo-button').click().then(function() {
      return app.client.element('#time-signature-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, false)
      })
    })
  })

  /* Time signature click tests */
  it('Time signature appears on click', function () {
    return app.client.element('#time-signature-button').click().then(function() {
      return app.client.element('#time-signature-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, true)
      })
    })
  })

  it('Tempo does not appear on time signature click', function () {
    return app.client.element('#time-signature-button').click().then(function() {
      return app.client.element('#tempo-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, false)
      })
    })
  })

  it('Key signature does not appear on time signature click', function () {
    return app.client.element('#time-signature-button').click().then(function() {
      return app.client.element('#key-signature-input').isVisible().then(function(isVisible) {
        return assert.equal(isVisible, false)
      })
    })
  })
})
