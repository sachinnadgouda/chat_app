var io = require('socket.io').listen(5000);
var clients = {};

var verboseServer = false; //Good for debugging the server

verboseServer && console.log("ChatServer Started"); //If Verbose Debug
io.sockets.on('connection', function (socket) {
  verboseServer && console.log("New Connection"); //If Verbose Debug
  var userhandle;
  socket.on('connection handle',function(user){
    verboseServer && console.log("Connection handle"); //If Verbose Debug
    userhandle = user.handle;
    clients[user.handle] = socket;
    io.sockets.emit('new user', user.handle + " has joined.");
  });

  socket.on('message', function(msg){
    verboseServer && console.log("New msg"); //If Verbose Debug
    io.sockets.emit('message', msg);
  });

  socket.on('private message', function(msg){
    verboseServer && console.log("New PM"); //If Verbose Debug
    fromMsg = {from:userhandle, txt:msg.txt}
    clients[msg.to].emit('private message', fromMsg);  
  });

  socket.on('disconnect', function(){
    verboseServer && console.log("disconnect"); //If Verbose Debug
    delete clients[userhandle];
  });
});