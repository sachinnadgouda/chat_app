var express=require('express');
var app=express();
var http=require('http').Server(app);
var io = require('socket.io')(http);
var ip = require('ip');
var session = require('express-session');
var port = 3000;
app.use(express.static('./')); 

app.use(session({
	secret: 'testsecret',
	resave: true,
    saveUninitialized: true
}));

require("./controller/controller.js")(app,io);
require("./controller/registration-controller.js")(app,io);

http.listen(port,function(){
    console.log("Node Server is setup and it is listening on http://"+ip.address()+":"+port);
})