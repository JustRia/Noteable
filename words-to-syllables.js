var nlp = require('compromise');
var nlpSyllables = require('nlp-syllables');
nlp.plugin(nlpSyllables);
console.log(nlpSyllables.Term.syllables("conundrum"));

function splitWords(words) {
    var wordsList = words.split(" ");
    var syllablesList = [];
    console.log(wordsList);
    for (let word of wordsList) {
        console.log(word);
        syllablesList.push(...nlpSyllables.Term.syllables(word));
    }
    console.log(syllablesList);
    // do the next thing
}
