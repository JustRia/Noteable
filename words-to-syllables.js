var nlp = require('compromise');
var nlpSyllables = require('nlp-syllables');
nlp.plugin(nlpSyllables);

module.exports = {
    // Split words in a string into its syllables
    // Returns an array of syllables 
    splitWords: function(words) {
        var wordsList = words.split(" ");
        var syllablesList = [];
        for (let word of wordsList) {
            syllablesList.push(nlpSyllables.Term.syllables(word));
        }
        return syllablesList;
    }
}
