// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var detectTempoButton = document.getElementById("detect-tempo-button");
var tempoCountdown = document.getElementById("tempo-countdown");
var tempoInput = document.querySelector("input[name='tempo']");
var detectingTempoContent =  document.getElementById("detecting-tempo-div");
var taps;
var startTime, endTime;
var detectingTempo = false;
var tempoBPM;
detectTempoButton.addEventListener("click", startDetectTempo);
document.addEventListener("keypress", keyPress);

function startDetectTempo () {
    detectingTempoContent.classList.remove("hidden");
    detectingTempo = true;
    taps = 10;
    tempoCountdown.innerText = "" + taps + " times";
    detectTempoButton.blur();
}

function keyPress (e) {
    if (detectingTempo) {
        if (e.keyCode == 32) {
            e.preventDefault();
            if (taps == 10) {
                startTime = new Date();
            }
            taps--;
            tempoCountdown.innerText = "" + taps + " times";
            if (taps == 0) {
                detectingTempo = false;
                endTime = new Date();
                var elapsedTime = endTime.getTime() - startTime.getTime();
                tempoBPM = 9 / (elapsedTime / 60000);
                console.log(tempoBPM);
                tempoInput.value = Math.round(tempoBPM);
                detectingTempoContent.classList.add("hidden")
            }
        }
    }
}