var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var app = express();

app.use(express.static('./'));


app.listen(3000, function () {
	//var host = server.address().address;
	//var port = server.address().port;

	console.log('Example app listening at http');
});


app.get('/', function (req, res) {

	fs.readFile('Editor.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<script >var fileName = "Shibuya";</script>');
		res.write(data);
		res.end();
	});
});


app.post('/editor.html', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
		console.log(fields);
		console.log(files);
		fs.readFile('Editor.html', function(err, data) {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write('<script >var fileName = "'+fields.fileName+'";</script>'+data);
			res.end();
		});
    });

});

