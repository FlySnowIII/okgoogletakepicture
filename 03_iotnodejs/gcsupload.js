// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage({
    keyFilename: "./keys/p908-azest-smart-office-firebase-adminsdk-u1na0-165f16c8c8.json"
});
// gs://p908-azest-smart-office.appspot.com/iot/azest6f-takepicture-1544376610881.jpg
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const bucketName = 'p908-azest-smart-office.appspot.com';
const foldername = './photos/'
const filename = 'test.txt';
const filepath = foldername+'test.txt';
const gcsfoldername = 'iot'
const gcsfilepath = `${gcsfoldername}/${filename}`;

// Uploads a local file to the bucket
storage.bucket(bucketName).upload(filepath, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    destination:gcsfilepath,
    metadata: {
    // Enable long-lived HTTP caching headers
    // Use only if the contents of the file will never change
    // (If the contents will change, use cacheControl: 'no-cache')
    // cacheControl: 'public, max-age=31536000',
    },
})
.then(function(obj){
    storage
        .bucket(bucketName)
        .file(gcsfilepath)
        .makePublic()
        .then(() => {
            console.log(`gs://${bucketName}/${filename} is now public.`);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
    console.log(`${filename} uploaded to ${bucketName}.`);

});
