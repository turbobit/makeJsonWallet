var Web3 = require('web3');
var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
app.use(cors({origin: '*'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/:pk/:pw', function(req, res) {
	var pk = req.params.pk;
	var pw = req.params.pw;
	console.log('got get' , getDateTime());
	console.log('got pk' , pk);
	console.log('got pw' , pw);

	var re = (web3.eth.accounts.encrypt(pk, pw));

	var now = new Date;
	var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate() , 
		now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());

	var filename = 'esnWallet--' + utc_timestamp + '--' + re.address + '.json';
	res.set('Content-Type','application/javascript');
	res.set('Content-Disposition','attachment; filename=' + filename);

	res.json((  re ) );
	res.end();
});

app.listen(3000);

function getDateTime() {
	var date = new Date();
	var hour = date.getHours();
	hour = (hour < 10 ? "0" : "") + hour;
	var min  = date.getMinutes();
	min = (min < 10 ? "0" : "") + min;
	var sec  = date.getSeconds();
	sec = (sec < 10 ? "0" : "") + sec;
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = (month < 10 ? "0" : "") + month;
	var day  = date.getDate();
	day = (day < 10 ? "0" : "") + day;
	return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}
