// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var detectTempoButton = document.getElementById("detect-tempo-button");
var tempoCountdown = document.getElementById("tempo-countdown");
var taps;
var detectingTempo = false;
detectTempoButton.addEventListener("click", startDetectTempo);
document.addEventListener("keypress", keyPress);

function startDetectTempo () {
    detectingTempo = true;
    taps = 10;
    tempoCountdown.innerText = "" + taps + " times";
    detectTempoButton.blur();
}

function keyPress (e) {
    if (detectingTempo) {
        console.log(e.keyCode);
        taps--;
        tempoCountdown.innerText = "" + taps + " times";
    }
}