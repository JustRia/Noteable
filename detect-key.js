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

    // Find best key signature
    for (let measure of measures) {
        for (let note of measure) {
            if (note.note != "rest") {
            var pos = notePos.indexOf(note.note);
                for (let key of majorKeys) {
                    // If note fits in the key, add points to that key
                    // Points are based on note length
                    if (note.accidental) {
                        if (note.accidental == key.notes[pos]) {
                            key.points += note.note_length;
                        } else if (note.accidental == "#") {
                            if (note.note == "F") {
                                if (key.notes[notePos.indexOf("G")] == "b") {
                                    key.points += note.note_length;
                                }
                            } else if (note.note == "G") {
                                if (key.notes[notePos.indexOf("A")] == "b") {
                                    key.points += note.note_length;
                                }
                            } else if (note.note == "A") {
                                if (key.notes[notePos.indexOf("B")] == "b") {
                                    key.points += note.note_length;
                                }
                            }
                        } else if (note.accidental == "b") {
                            if (note.note == "D") {
                                if (key.notes[notePos.indexOf("C")] == "#") {
                                    key.points += note.note_length;
                                }
                            } else if (note.note == "E") {
                                if (key.notes[notePos.indexOf("F")] == "#") {
                                    key.points += note.note_length;
                                }
                            }
                        }
                    } else {
                        if (key.notes[pos] == "n") {
                            key.points += note.note_length;
                        }
                    }
                }
            }
        }
    }
    console.log(majorKeys);
    var maxPoints = 0;
    var bestKey = "";
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