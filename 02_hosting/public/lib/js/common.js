/**
 * Init Main Vue
 */
var app = new Vue({
    el: '#app',
    data: () => ({
        drawer: null,
        items: [
            { icon: 'dashboard', text: 'Dashboard' ,url:'main.html'},
            // { divider: true },
            // { heading: 'AZEST 6F' },
            // { icon: 'date_range', text: 'Loading...' },
            // { divider: true },
            // { icon: 'input', text: 'Logout',type:'logout' }
        ],
        photos: [
            // {
            //     title: 'Pre-fab homes',
            //     src: 'https://cdn.vuetifyjs.com/images/cards/house.jpg',
            //     flex: 3
            // },
        ]
    }),
    props: {
        source: "www.nbfab.com"
    },
    methods:{
        menuclick:function(item){
            if (item.hasOwnProperty('url')) {
                location.href = item.url;
            }
        }
    }
});

/**
 * Initialize Firebase
 */
var config = {
    apiKey: "AIzaSyB5tCoMhQDJPOWqcnU_GgwcPx3MzQddDVU",
    authDomain: "p908-azest-smart-office.firebaseapp.com",
    databaseURL: "https://p908-azest-smart-office.firebaseio.com",
    projectId: "p908-azest-smart-office",
    storageBucket: "p908-azest-smart-office.appspot.com",
    messagingSenderId: "593180806560"
};
firebase.initializeApp(config);

/**
 * Init Left Menu
 */
firebase.database().ref('/takepicture').child('menu').once('value').then(function(snapshot) {
    var fbmenu = snapshot.val();
    //FirebaseDBからメニューデータを獲得する
    for (const key in fbmenu) {
        //大項目の場合
        app.items.push({ divider: true });
        app.items.push({ heading: key });
        //小項目を初期するため、まず最新順に表示するようにObjectを反転してArrayに変換する
        const roomArray = objtoarray(fbmenu[key]);
        for (const iterator of roomArray) {
            iterator.url = 'photolist.html?room='+key+'&date='+iterator.date;
            app.items.push(iterator);
        }
    }
});


/********************************************************************************* */

/**
 *  GETパラメータを配列にして返す
 *
 *  @return     パラメータのObject
 *
 */
function getUrlVars(){
    var vars = {};
    var param = location.search.substring(1).split('&');
    for(var i = 0; i < param.length; i++) {
        var keySearch = param[i].search(/=/);
        var key = '';
        if(keySearch != -1) key = param[i].slice(0, keySearch);
        var val = param[i].slice(param[i].indexOf('=', 0) + 1);
        if(key != '') vars[key] = decodeURI(val);
    }
    return vars;
}

/**
 * ObjectをArrayに変換する
 * @param {*} object
 * @param {*} sortdesc 反転するかどうか
 */
function objtoarray(object,sortdesc=false){
    let returnArray = [];

    if(!object){
        return [];
    }

    for (const key in object) {
        const element = object[key];
        element.objid = key;

        if(sortdesc){
            returnArray.push(element);
        }
        else{
            returnArray.unshift(element);
        }
    }

    return returnArray;
}

function turnYYYYMMDD(timestamp){
    var dt = new Date(Number(timestamp));
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth()+1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var h = ("00" + dt.getHours()).slice(-2);
    var mm = ("00" + dt.getMinutes()).slice(-2);

    return `${y}-${m}-${d} ${h}:${mm}`;

}