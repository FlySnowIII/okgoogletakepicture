// Firebase 設定
const admin = require("firebase-admin");
const serviceAccount = require("./keys/oktakepicture-firebase-adminsdk-ntciv-566bc363b1.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://oktakepicture.firebaseio.com"
});
const firebaseDatabase = admin.database();


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
                    runAction();
                }
        }
    }
});


function runAction() {
    
}