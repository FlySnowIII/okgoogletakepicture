const request = require('request');

var URL = 'http://localhost:5000/p908-azest-smart-office/us-central1/iiftttwebapi';
var URL = 'https://us-central1-p908-azest-smart-office.cloudfunctions.net/iiftttwebapi';


request.post({
    uri: URL,
    headers: { "Content-type": "application/json" },
    json: {
        room:'azest6f',
        action:'takepicture'
    }
}, (err, res, data) => {
    console.log(data);
});

