var nlp = require('compromise');
var nlpSyllables = require('nlp-syllables');
nlp.plugin(nlpSyllables);

module.exports = {
    splitWords: function(words) {
        var wordsList = words.split(" ");
        var syllablesList = [];
        for (let word of wordsList) {
            syllablesList.push(...nlpSyllables.Term.syllables(word));
        }
        console.log(syllablesList);
        return syllablesList;
    }
}
