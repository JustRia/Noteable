var nlp = require('compromise');
console.log(nlp);
var nlpSyllables = require('nlp-syllables');
console.log(nlpSyllables);

nlp.plugin(nlpSyllables);
console.log(nlp);
var t2 = nlp('houston texas');
console.log(t2.list[0]);
nlpSyllables.Term.syllables("cat");
//[ [ 'hous', 'ton' ], [ 'tex', 'as' ] ]