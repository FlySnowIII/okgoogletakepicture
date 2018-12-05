const functions = require('firebase-functions');
// Firebase 設定
const admin = require("firebase-admin");
const serviceAccount = require("./keys/oktakepicture-firebase-adminsdk-ntciv-566bc363b1.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://oktakepicture.firebaseio.com"
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