var inputFlags = [0,0,0];
var key_signature_input;
var tempo_input;
var time_signature_top_num_input;
var time_signature_bottom_num_input;
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
        key_signature_input = document.querySelector('[name="key-signature"]').value;
        console.log("key signature = " + key_signature_input);
        document.getElementById("key-signature-confirmation").classList.add("confirmed");
    } else if (input == "tempo") {
        inputFlags[1] = 1;
        tempo_input = document.querySelector('[name="tempo"]').value;
        console.log("tempo = " + tempo_input);
        document.getElementById("tempo-confirmation").classList.add("confirmed");
    } else if (input == "time-signature") {
        inputFlags[2] = 1;
        time_signature_top_num_input = document.querySelector('[name="time-signature-top-num"]').value;
        time_signature_bottom_num_input = document.querySelector('[name="time-signature-bottom-num"]').value;
        console.log("time signature = " + time_signature_top_num_input + "/" + time_signature_bottom_num_input);
        document.getElementById("time-signature-confirmation").classList.add("confirmed");
    }

    var enableButton = true;
    for (var i = 0; i < 3; i++) {
        if (inputFlags[i] == 0) {
            enableButton = false;
        }
    }

    if (enableButton) {
        mic_icon = document.getElementById("mic-icon");
        mic_icon.classList.remove("disabled-button");
    }
    return false;
}

function disable_input(input) {
    var checkbox = document.getElementById("auto-detect-key-signature").checked;
    if (checkbox) {
        // disable stuff
        if (input == 'key-signature') {
            document.getElementById("key-signature-selector").disabled = true;
        }
    } else {
        // enable stuff
        if (input == 'key-signature') {
            document.getElementById("key-signature-selector").disabled = false;
        }
    }
}

function checkPowerOfTwo() {
    var bottomNumInput = document.querySelector('[name="time-signature-bottom-num"]');
    if (!isPowerOfTwo(bottomNumInput.value)) {
        bottomNumInput.setCustomValidity("Value must be a power of 2.");
    }
    else {
        bottomNumInput.setCustomValidity("");
    }
}

function isPowerOfTwo(n)
{
    if (n == 0)
        return false;

    while (n != 1)
    {
        if (n % 2 != 0)
            return false;
        n = n / 2;
    }
    return true;
}
