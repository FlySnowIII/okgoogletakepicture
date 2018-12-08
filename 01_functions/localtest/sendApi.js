const request = require('request');

var URL = 'http://localhost:5000/p908-azest-smart-office/us-central1/iiftttwebapi';

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