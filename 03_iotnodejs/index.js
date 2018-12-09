// Firebase 設定
const admin = require("firebase-admin");
const serviceAccount = require("./keys/p908-azest-smart-office-firebase-adminsdk-u1na0-ad272cd55f.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://p908-azest-smart-office.firebaseio.com"
});
const firebaseDatabase = admin.database();
// Node-webcam
const NodeWebcam = require("node-webcam");
const execSync = require('child_process').execSync;
//Default options
const opts = {
    //Picture related
    // width: 1280,
    // height: 720,
    quality: 100,
    //Delay to take shot
    delay: 0,
    //Save shots in memory
    saveShots: true,
    // [jpeg, png] support varies
    // Webcam.OutputTypes
    output: "jpeg",
    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,
    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes
    callbackReturn: "location",
    //Logging
    verbose: false
};
//Creates webcam instance
const Webcam = NodeWebcam.create( opts );


if(process.argv.length < 4){
    console.log("Please input paramter like: node index.js azest6f takepicture");
    process.exit(1);
}

var ROOM_CODE = process.argv[2];
var ROOM_ACTION = process.argv[3];

console.log(`Program is running: /rooms/${ROOM_CODE}/${ROOM_ACTION}`);

firebaseDatabase.ref('/rooms').child(ROOM_CODE).child(ROOM_ACTION)
.on('value',function(snapshort){
    var fbdbObj = snapshort.val();
    if(fbdbObj){
        if (fbdbObj.hasOwnProperty('state')==true ||
            fbdbObj.hasOwnProperty('timestamp')==true) {
                if(fbdbObj.state == 1){
                    runAction(fbdbObj);
                }
        }
    }
});


function runAction(dataObj) {
    Webcam.capture(`photos/${dataObj.room}-${dataObj.action}-${dataObj.timestamp}`, function( err, data ) {
        if(err){
            console.log(err);
        }
        else{
            const result =  execSync(`gsutil cp ${data} gs://p908-azest-smart-office.appspot.com/iot/`).toString();
            console.log(result);
        }
    } );
}