function detectKey(measures) {
    // Information for sharps and flats in each key
    var majorKeys = [
        //         ["A", "B", "C", "D", "E", "F", "G"]
        {
            name: "Ab",
            notes: ["b", "b", "n", "b", "b", "n", "n"],
            points: 0
        },
        {
            name: "A",
            notes: ["n", "n", "#", "n", "n", "#", "#"],
            points: 0
        },
        {
            name: "Bb",
            notes: ["n", "b", "n", "n", "b", "n", "n"],
            points: 0
        },
        {
            name: "B",
            notes: ["#", "n", "#", "#", "n", "#", "#"],
            points: 0
        },
        {
            name: "C",
            notes: ["n", "n", "n", "n", "n", "n", "n"],
            points: 0
        },
        {
            name: "Db",
            notes: ["b", "b", "n", "b", "b", "n", "b"],
            points: 0
        },
        {
            name: "D",
            notes: ["n", "n", "#", "n", "n", "#", "n"],
            points: 0
        },
        {
            name: "Eb",
            notes: ["b", "b", "n", "n", "b", "n", "n"],
            points: 0
        },
        {
            name: "E",
            notes: ["n", "n", "#", "#", "n", "#", "#"],
            points: 0
        },
        {
            name: "F",
            notes: ["n", "b", "n", "n", "n", "n", "n"],
            points: 0
        },
        {
            name: "F#",
            notes: ["#", "n", "#", "#", "#", "#", "#"],
            points: 0
        },
        {
            name: "Gb",
            notes: ["b", "b", "b", "b", "b", "n", "b"],
            points: 0
        },
        {
            name: "G",
            notes: ["n", "n", "n", "n", "n", "#", "n"],
            points: 0
        }
    ];
    const notePos ="ABCDEFG";
    const noteNames = [
        [{note: "G", accidental: "#"}, {note: "A", accidental: "b"}],
        [{note: "A"}],
        [{note: "A", accidental: "#"}, {note: "B", accidental: "b"}],
        [{note: "B"}, {note: "C", accidental: "b"}],
        [{note: "B", accidental: "#"}, {note: "C"}],
        [{note: "C", accidental: "#"}, {note: "D", accidental: "b"}],
        [{note: "D"}],
        [{note: "D", accidental: "#"}, {note: "E", accidental: "b"}],
        [{note: "E"}, {note: "F", accidental: "b"}],
        [{note: "E", accidental: "#"}, {note: "F"}],
        [{note: "F", accidental: "#"}, {note: "G", accidental: "b"}],
        [{note: "G"}],
    ];

    // Find best key signature
    for (let measure of measures) {
        for (let note of measure) {
            if (note.note != "rest") {
                // If note fits in the key, add points to that key
                // Points are based on note length
                for (let noteName of noteNames) {
                    for (let noteN of noteName) {
                        if ((note.note == noteN.note) && ((note.accidental == noteN.accidental) || (!note.accidental && !noteN.accidental))) {
                            for (let noteN2 of noteName) {
                                var pos = notePos.indexOf(noteN2.note);
                                for (let key of majorKeys) {
                                    if (noteN2.accidental) {
                                        if (noteN2.accidental == key.notes[pos]) {
                                            console.log(note);
                                            console.log(noteN2);
                                            key.points += note.note_length;
                                        } 
                                    } else {
                                        if (key.notes[pos] == "n") {
                                            console.log(note);
                                            console.log(noteN2);
                                            key.points += note.note_length;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log(majorKeys);
    var maxPoints = 0;
    var bestKey = undefined;
    // Key with the most points is the best key
    for (let key of majorKeys) {
        if (key.points > maxPoints) {
            bestKey = key.name;
            maxPoints = key.points;
        }
    }
    console.log("Best key:", bestKey);
    return bestKey;
}