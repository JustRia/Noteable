var nlp = require('compromise');
var nlpSyllables = require('nlp-syllables');
nlp.plugin(nlpSyllables);

module.exports = {
    // Split words in a string into its syllables
    // Returns an array of syllables 
    splitWords: function(words, measures) {
        var wordsList = words.split(" ");
        var syllablesList = [];
        for (let word of wordsList) {
            syllablesList.push(nlpSyllables.Term.syllables(word));
        }
        console.log(syllablesList);
        console.log(measures);
        renderSheetMusic(measures, syllablesList);
        // create abcjs object to display
        updateProgress("parse-notes-to-render");
        //return syllablesList;
    }
}
