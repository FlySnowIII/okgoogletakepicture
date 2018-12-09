const functions = require('firebase-functions');
// Firebase 設定
const admin = require("firebase-admin");
const serviceAccount = require("./keys/p908-azest-smart-office-firebase-adminsdk-u1na0-78dc4cf29a.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://p908-azest-smart-office.firebaseio.com"
});
const firebaseDatabase = admin.database();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


/**
 * 01. IFTTT用WebAPI
 * 説明:
 *  Google Homeのアクションを応じるWebAPIです。
 *  Firebase RealtimeDatebaseのIoTデバイスの状態変数を変更する処理を行います。
 * パラメータ:
 * request:{
 *  room:<string> 部屋番号
 *  action:<string> アクションコード
 * }
 * return ifttt is ok
 */
exports.iiftttwebapi = functions.https.onRequest((request, response) => {
    // パラメータチェック
    if (request.body.hasOwnProperty('room')==false ||
        request.body.hasOwnProperty('action')==false) {
        response.send("Error: Please set data like {room:'roomid',action:'actioncode'}");
        return;
    }

    // Firebase Realtimedatabaseに格納するデータを準備
    let roomObj = {
        room: request.body.room,
        action: request.body.action,
        state: 1,
        timestamp:new Date().getTime()
    }
    // Firebase Realtimedatabaseにデータを保存
    firebaseDatabase.ref('/rooms').child(request.body.room).child(request.body.action).set(roomObj);
    // 処理ヒストリーも記録する
    let newPostKey = firebaseDatabase.ref('/rooms').child('history').push().key;
    roomObj.firebasekey = newPostKey;
    firebaseDatabase.ref('/rooms').child('history').child(newPostKey).set(roomObj);


    // 処理終了
    response.send("ifttt is ok");
});

/**
 * IoTデバイスから撮った写真をGoogle Cloud Strogeにアップロードした後、Firebase RealtimeDatabaseに写真情報をInsertする
 */
exports.iotphotoupload = functions.storage.object().onFinalize((object)=>{
    const fileBucket = object.bucket; // The Storage bucket that contains the file.
    const filePath = object.name; // File path in the bucket.
    const contentType = object.contentType; // File content type.
    // const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.


    // TODO:サムネイル画像作成は後ほど開発する予定
    const thumbnail = filePath;

    let roomname = filePath.slice(4).split('-')[0];
    var timestamp = filePath.split('-')[2].split('.')[0];
    var dt = new Date(Number(timestamp));
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth()+1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var filedate = y + m + d;

    // メニューを更新する
    firebaseDatabase.ref('/takepicture').child('menu').child(roomname).once('value',function(snapshot){
        var menuObj = snapshot.val();
        if (!menuObj || !menuObj.hasOwnProperty(filedate)) {
            let newmenu = {
                icon: 'date_range',
                text: filedate,
                date: filedate,
            }
            console.log(newmenu);
            firebaseDatabase.ref('/takepicture').child('menu').child(roomname).child(filedate).update(newmenu);
        }
    });

    // azest6f-takepicture-1544319696590.jpg
    // 画像データをDBに更新する
    let newFileObj = {
        thumbnail:thumbnail,
        fileBucket:fileBucket,
        filePath:filePath,
        contentType:contentType,
        date: filedate
    };

    let newPostKey = firebaseDatabase.ref('/takepicture').child(roomname).push().key;
    newFileObj.firebasekey = newPostKey;
    firebaseDatabase.ref('/takepicture').child(roomname).child(newPostKey).set(newFileObj);

});