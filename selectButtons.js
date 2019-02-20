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
