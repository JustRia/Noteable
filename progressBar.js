// Progress Bar

/* 0: speech to text finished
 * 1: Note detection finished
 * 2: Notes split into measures finished
 * 3: auto detected key finished
 * 4: parseing notes into abcjs format has finished
 */

/*
 * Example: updateProgress("speech-to-text")
 * will update the progress bar appropriately
 */
var progress = [0,0,0,0,0];
function updateProgress(input) {
    switch (input) {
        case "speech-to-text":
            progress[0] = 1;
            break;
        case "note-detection":
            progress[1] = 1;
            break;
        case "measure-detection":
            progress[2] = 1;
            break;
        case "auto-detect-key":
            progress[3] = 1;
            break;
        case "parse-notes-to-render":
            progress[4] = 1;
            break;
        default:
            console.log("you used updateProgress incorrectly. Please send a valid argument");
            break;
    }

    var percent = 0;
    for (var i = 0; i < progress.length; i++) {
        if (progress[i] == 1) {
            percent += 100 / progress.length;
        }
    }
    document.getElementById("progress-fill").style.width = percent + "%";
    if (percent >= 99.8) {
        // wait for animation to finish and then display sheet music
        setTimeout(function(){
            // show the sheet music
            document.getElementById("progress-bar-main-content").classList.add("hidden");
            document.getElementById("sheet-music-main-content").classList.remove("hidden");
            // enable retry button
            document.getElementById("retry-icon").classList.remove("hidden");
            document.getElementById("mic-icon").classList.add("hidden");
        }, 1000);
    }
    return percent + "%";
}
