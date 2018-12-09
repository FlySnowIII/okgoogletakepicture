/**
 * InitPhoto
 */

var _GETOBJ = getUrlVars();

var _PHOTOLIST = {};

if(!_GETOBJ){
    console.log("AAAAAAAAAA")
}
// http://localhost:5000/photolist.html?room=azest6f&date=20181209
if (_GETOBJ.hasOwnProperty('room') && _GETOBJ.hasOwnProperty('date')) {
    firebase.database().ref('/takepicture').child(_GETOBJ.room)
        .orderByChild('date').startAt(_GETOBJ.date).endAt(_GETOBJ.date)
        .on('value',function(snapshot) {
            const photoObj = snapshot.val();
            for (const key in photoObj) {
                const element = photoObj[key];
                if (_PHOTOLIST.hasOwnProperty(key)) {
                    continue;
                }

                firebase.storage().ref(element.thumbnail).getDownloadURL().then(url => {
                    url
                    app.photos.unshift({
                        title:element.date,
                        // src:'https://i.ytimg.com/vi/ktlQrO2Sifg/maxresdefault.jpg',
                        // src:'https://www.googleapis.com/download/storage/v1/b/p908-azest-smart-office.appspot.com/o/iot%2Fazest6f-takepicture-1544357663898.jpg?generation=1544369683552145&alt=media',
                        src:url,
                        firebasekey:element.firebasekey
                    });
                });
            }
            _PHOTOLIST = photoObj;
        });
}

// https://firebasestorage.googleapis.com/v0/b/p908-azest-smart-office.appspot.com/o/iot%2Fazest6f-takepicture-1544357263898.jpg?alt=media&token=10d425c5-07b5-40c2-bacd-8ee4a0c26097

var aaa = {
    bucket: 'p908-azest-smart-office.appspot.com',
    contentDisposition: 'inline; filename*=utf-8\'\'azest6f-takepicture-1544367663898.jpg',
    contentType: 'image/jpeg',
    crc32c: 'xZpULg==',
    etag: 'CJG64uuKk98CEAE=',
    generation: '1544370070789393',
    id: 'p908-azest-smart-office.appspot.com/iot/azest6f-takepicture-1544367663898.jpg/1544370070789393',
    kind: 'storage#object',
    md5Hash: '0u8/jfQzfnytLxRy4Zmxsg==',
    mediaLink: 'https://www.googleapis.com/download/storage/v1/b/p908-azest-smart-office.appspot.com/o/iot%2Fazest6f-takepicture-1544367663898.jpg?generation=1544370070789393&alt=media',
    metadata: { firebaseStorageDownloadTokens: '662ee082-52c4-446d-bcd4-08bf0d57f0aa' },
    metageneration: '1',
    name: 'iot/azest6f-takepicture-1544367663898.jpg',
    selfLink: 'https://www.googleapis.com/storage/v1/b/p908-azest-smart-office.appspot.com/o/iot%2Fazest6f-takepicture-1544367663898.jpg',
    size: '490633',
    storageClass: 'STANDARD',
    timeCreated: '2018-12-09T15:41:10.789Z',
    timeStorageClassUpdated: '2018-12-09T15:41:10.789Z',
    updated: '2018-12-09T15:41:10.789Z'
}