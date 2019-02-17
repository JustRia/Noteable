// Imports the Google Cloud client library.
const {Storage} = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');

// Instantiates a client. If you don't specify credentials when constructing
// the client, the client library will look for credentials in the
// environment.
const storage = new Storage();

// Set environment variable
process.env.GOOGLE_APPLICATION_CREDENTIALS="noteable-d12e9bdafe4f.json";

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

// The name of the audio file to transcribe
//const fileName = './resources/audio-samples/male-sung/dreaming-of-a-white-christmas.wav';

function syncRecognize(audioBuffer) {
  // Reads a local audio file and converts it to base64
  // fileName = './resources/audio-samples/male-misc/audio.raw';
  // const file = fs.readFileSync(fileName);
  // console.log("File:");
  // console.log(file);
  console.log(audioBuffer);
  //const audioBytes = file.toString('base64');

  const floatArray = audioBuffer.getChannelData(0);
  console.log(floatArray);
  let bufferLength = floatArray.length - 1;
  const intArray = new Int16Array(bufferLength);
  while (bufferLength !== -1) {
    const temp = Math.max(-1, Math.min(1, audioBuffer[bufferLength]));
    intArray[bufferLength] = temp < 0 ? temp * 0x8000 : temp * 0x7FFF;
    bufferLength--;
  }

  const binaryString = new Uint8Array(intArray).reduce((data, byte) => data + String.fromCharCode(byte), '');
  const audioBytes = btoa(binaryString);

  //const audioBytes = intArray.toString('base64');
  console.log("Audio bytes:");
  console.log(audioBytes);

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    languageCode: 'en-US',
    encoding: 'LINEAR16',
    sampleRateHertz: audioBuffer.sampleRate,
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
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}