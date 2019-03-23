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
]

const notePos ="abcdefg";

function detectKey(measures) {
    console.log(measures);
    for (let measure of measures) {
        console.log(measure);
        for (let note of measure) {
            console.log(note);
            if (note.note != "rest") {
            var pos = notePos.indexOf(note.note);
                for (let key of majorKeys) {
                    console.log(key.name);
                    console.log(key.notes[pos]);
                    if (note.accidental) {
                        if (note.accidental == key.notes[pos]) {
                            console.log("MATCH");
                        }
                    } else {
                        if (key.notes[pos] == "na") {
                            console.log("MATCH");
                        }
                    }
                }
            }
        }
    }
}