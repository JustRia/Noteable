// Progress Bar

/* 0: speech to text finished
 * 1: Note frequency detection finished
 * 2: Note detection finished
 * 3: Notes split into measures finished
 * 4: auto detected key finished
 * 5: Measures inputted to renderer finished
 * 6: We have our outputted sheet music :)
 */
var progress = [0,0,0,0,0,0,0];
function updateProgress(input) {
    switch (input) {
        case "speech-to-text":
            progress[0] = 1;
            break;
        case "frequency-detection":
            progress[1] = 1;
            break;
        case "note-detection":
            progress[2] = 1;
            break;
        case "measure-detection":
            progress[3] = 1;
            break;
        case "auto-detect-key":
            progress[4] = 1;
            break;
        case "input-to-renderer":
            progress[5] = 1;
            break;
        case "finished":
            progress[6] = 1;
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
    if (percent >= 99.9) {
        // wait for animation to finish and then display sheet music
        setTimeout(function(){
            document.getElementById("progress-bar-main-content").classList.add("hidden");
            document.getElementById("sheet-music-main-content").classList.remove("hidden");
        }, 1000);
    }
    return percent + "%";
}
