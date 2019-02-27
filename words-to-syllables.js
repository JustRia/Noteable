var unirest = require('unirest');

function splitWords(words) {
    console.log(words);
    var wordsList = words.split(" ");
    console.log(wordsList);
    for (let word of wordsList) {
        console.log(word);
        let requestURL = "https://wordsapiv1.p.rapidapi.com/words/" + word + "/syllables"
        unirest.get(requestURL)
        .header("X-RapidAPI-Key", "d83853f983msh483d9fa21a34fa8p158c71jsnab8df9a9973a")
        .end(function (result) {
            console.log(result.status, result.headers, result.body);
        });
    }
}