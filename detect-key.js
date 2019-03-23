function detectKey(measures) {
    var majorKeys = [
        //         ["A ", "B ", "C ", "D ", "E ", "F ", "G "]
        {
            name: "Ab",
            notes: ["es", "es", "na", "es", "es", "na", "na"],
            points: 0
        },
        {
            name: "A",
            notes: ["na", "na", "is", "na", "na", "is", "is"],
            points: 0
        },
        {
            name: "Bb",
            notes: ["na", "es", "na", "na", "es", "na", "na"],
            points: 0
        },
        {
            name: "B",
            notes: ["is", "na", "is", "is", "na", "is", "is"],
            points: 0
        },
        {
            name: "C",
            notes: ["na", "na", "na", "na", "na", "na", "na"],
            points: 0
        },
        {
            name: "Db",
            notes: ["es", "es", "na", "es", "es", "na", "es"],
            points: 0
        },
        {
            name: "D",
            notes: ["na", "na", "is", "na", "na", "is", "na"],
            points: 0
        },
        {
            name: "Eb",
            notes: ["es", "es", "na", "na", "es", "na", "na"],
            points: 0
        },
        {
            name: "F",
            notes: ["na", "es", "na", "na", "na", "na", "na"],
            points: 0
        },
        {
            name: "F#",
            notes: ["is", "na", "is", "is", "is", "is", "is"],
            points: 0
        },
        {
            name: "Gb",
            notes: ["es", "es", "es", "es", "es", "na", "es"],
            points: 0
        },
        {
            name: "G",
            notes: ["na", "na", "na", "na", "na", "is", "na"],
            points: 0
        }
    ];
    const notePos ="abcdefg";

    //console.log(measures);
    for (let measure of measures) {
        //console.log(measure);
        for (let note of measure) {
            //console.log(note);
            if (note.note != "rest") {
            var pos = notePos.indexOf(note.note);
                for (let key of majorKeys) {
                    //console.log(key.name);
                    //console.log(key.notes[pos]);
                    if (note.accidental) {
                        if (note.accidental == key.notes[pos]) {
                            key.points += note.note_length;
                        } else if (note.accidental == "is") {
                            if (note.note == "f") {
                                if (key.notes[notePos.indexOf("g")] == "es") {
                                    key.points += note.note_length;
                                }
                            } else if (note.note == "g") {
                                if (key.notes[notePos.indexOf("a")] == "es") {
                                    key.points += note.note_length;
                                }
                            } else if (note.note == "a") {
                                if (key.notes[notePos.indexOf("b")] == "es") {
                                    key.points += note.note_length;
                                }
                            }
                        } else if (note.accidental == "es") {
                            if (note.note == "d") {
                                if (key.notes[notePos.indexOf("c")] == "is") {
                                    key.points += note.note_length;
                                }
                            } else if (note.note == "e") {
                                if (key.notes[notePos.indexOf("f")] == "is") {
                                    key.points += note.note_length;
                                }
                            }
                        }
                    } else {
                        if (key.notes[pos] == "na") {
                            key.points += note.note_length;
                        }
                    }
                }
            }
        }
    }
    console.log(majorKeys);
}