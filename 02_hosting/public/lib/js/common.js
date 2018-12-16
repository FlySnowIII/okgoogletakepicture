/**
 * Init Main Vue
 */
var app = new Vue({
    el: '#app',
    data: () => ({
        drawer: null,
        items: [
            { icon: 'schedule', text: 'Loading...'},
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
        ],
        events: [
            // {id:1,text:'hellp',time:'555'}
        ],
    }),
    props: {
        source: "www.nbfab.com"
    },
    computed: {
        timeline() {
            return this.events.slice().reverse()
        }
    },
    methods:{
        menuclick:function(item){
            if (item.hasOwnProperty('url')) {
                location.href = item.url;
                return;
            }
            if (item.hasOwnProperty('action')) {
                switch (item.action) {
                    case 'logout':
                        firebase.auth().signOut();
                        break;
                    default:
                        break;
                }
                return;
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
 * Is Login
 */
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        // var displayName = user.displayName;
        // var email = user.email;
        // var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // ...
        console.log('Login is sucsses:',user.uid);
    } else {
        // User is signed out.
        location.href = "index.html";
    }
});

/**
 * Init Left Menu
 */
firebase.database().ref('/takepicture').child('menu').on('value',function(snapshot) {
    app.items = [];
    app.events = [];
    var fbmenu = snapshot.val();
    //FirebaseDBからメニューデータを獲得する
    for (const key in fbmenu) {
        //小項目を初期するため、まず最新順に表示するようにObjectを反転してArrayに変換する
        const roomArray = objtoarray(fbmenu[key]);
        for (const iterator of roomArray) {
            iterator.url = 'photolist.html?room='+key+'&date='+iterator.date;
            app.items.unshift(iterator);
            app.events.unshift({id:iterator.text,text:iterator.text,time:key,url:iterator.url});
        }
        //大項目の場合
        app.items.unshift({ heading: key });
        app.items.unshift({ divider: true });
    }
    app.items.unshift({ icon: 'dashboard', text: 'Dashboard' ,url:'main.html'});
    app.items.push({ divider: true });
    app.items.push({ icon: 'power_settings_new', text: 'Logout' ,action:'logout'});
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