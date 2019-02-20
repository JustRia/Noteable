var inputFlags = [0,0,0];
var key_signature;
var tempo;
var time_signature_top_num;
var time_signature_bottom_num;
function addSelected(input) {
    var key_sig = document.getElementById("key-signature-button");
    var tempo = document.getElementById("tempo-button");
    var time_sig = document.getElementById("time-signature-button");
    var key_sig_content = document.getElementById("key-signature-input");
    var tempo_content = document.getElementById("tempo-input");
    var time_sig_content = document.getElementById("time-signature-input");
    var detecting_tempo_content =  document.getElementById("detecting-tempo-div");

    switch (input) {
        case "key-signature":
            key_sig.classList.add("selected");
            tempo.classList.remove("selected");
            time_sig.classList.remove("selected");

            key_sig_content.classList.remove("hidden");
            tempo_content.classList.add("hidden");
            time_sig_content.classList.add("hidden");

            break;
        case "tempo":
            key_sig.classList.remove("selected");
            tempo.classList.add("selected");
            time_sig.classList.remove("selected");

            key_sig_content.classList.add("hidden");
            tempo_content.classList.remove("hidden");
            time_sig_content.classList.add("hidden");

            break;
        case "time-signature":
            key_sig.classList.remove("selected");
            tempo.classList.remove("selected");
            time_sig.classList.add("selected");

            key_sig_content.classList.add("hidden");
            tempo_content.classList.add("hidden");
            time_sig_content.classList.remove("hidden");

            break;
    }
}

function submitForm(input) {
    /* get input values */
    if (input == "key-signature") {
        inputFlags[0] = 1;
        key_signature = document.querySelector('[name="key-signature"]').value;
        console.log(key_signature);
    } else if (input == "tempo") {
        inputFlags[1] = 1;
        tempo = document.querySelector('[name="tempo"]').value;
        console.log(tempo);
    } else if (input == "time-signature") {
        inputFlags[2] = 1;
        time_signature_top_num = document.querySelector('[name="time-signature-top-num"]').value;
        time_signature_bottom_num = document.querySelector('[name="time-signature-bottom-num"]').value;
        console.log(time_signature_top_num + "/" + time_signature_bottom_num);
    }

    var enableButton = true;
    for (var i = 0; i < 3; i++) {
        if (inputFlags[i] == 0) {
            enableButton = false;
        }
    }

    if (enableButton) {
        console.log("TODO: enable record button")
        // TODO:
        mic_icon = document.getElementById("mic-icon");
        mic_icon.classList.remove("disabled-button");
    }
    return false;
}
