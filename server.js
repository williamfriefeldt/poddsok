
var express = require("express");

var app = express();

app.use(express.static('public'))

//make way for some custom css and js 
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

var server = app.listen(8888, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});