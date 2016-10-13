var express =  require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var owners = require('./routes/owners');
var pets = require('./routes/pets');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/owners', owners);
app.use('/pets', pets);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './public/views/index.html'));
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  console.log('Listening on port ', server.address().port);
});
