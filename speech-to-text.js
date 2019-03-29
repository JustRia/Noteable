// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const words_to_syllables = require("./words-to-syllables.js");

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();

// Set environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS="noteable-139e67da6ae0.json";

// Makes an authenticated API request.
storage
    .getBuckets()
    .then((results) => {
        const buckets = results[0];

        console.log('Buckets:');
        buckets.forEach((bucket) => {
            console.log(bucket.name);
        });
    })
    .catch((err) => {
        console.error('ERROR:', err);
    });

const fs = require('fs');

// Creates a client
const client = new speech.SpeechClient();

/*
 * Takes a WAV blob and sample rate, converts and sends to Google Cloud Speech API.
 * Returns 
 */
function syncRecognize(blob, sampleRate) {
    console.log(blob);
    console.log(sampleRate);
    var audioBytes = '';
    var reader = new FileReader();

    // Read WAV blob as a file and convert to base64 string
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
        audioBytes = reader.result.substring(22);

        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            content: audioBytes,
        };
        const config = {
            languageCode: 'en-US',
            encoding: 'LINEAR16',
            sampleRateHertz: sampleRate,
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        client
            .recognize(request)
            .then(data => {
                const response = data[0];
                const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
                var syllables = words_to_syllables.splitWords(transcription);
                console.log(syllables);
            })
            .catch(err => {
                console.error('ERROR:', err);
            });
    }
}
