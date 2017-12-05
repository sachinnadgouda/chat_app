var models = require('../model/model.js');
var path = require('path');
var bodyParser = require('body-parser');
var sess;


module.exports = function (app,io){
    app.use( bodyParser.json() );
    app.use(bodyParser.urlencoded({     
        extended: true
    }));
    
    app.get('/',function(req,res){
        sess = req.session;
        res.sendFile(path.resolve(__dirname+"/../views/index.html"));
    });  
    
    var handle=null;
    var private=null;
    var users={};
    var keys={};
    
    app.post('/login',function(req,res){
        sess = req.session;
        console.log(req.body.handle);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        handle = req.body.handle;
        models.user.findOne({"handle":req.body.handle, "password":req.body.password},function(err,doc){
            if(err){
                res.send(err); 
            }
            if(doc==null){
                res.send("User has not registered");
            }
            else{
                sess.handle = req.body.handle;
                console.log("Asas"+__dirname);
//                res.sendFile(path.resolve(__dirname+"/../views/chat1.html"));
                res.send("success");
            }
            
    });
    });
    
    io.on('connection',function(socket){
        if(sess){
            handle = sess.handle
        }
        else{
            handle = "";
        }
        console.log("Connection : User is connected  "+ handle);
        io.to(socket.id).emit('handle',  handle);
        users[handle]=socket.id;
        keys[socket.id]= handle;
        models.user.find({"handle" : handle},{friends:1,_id:0},function(err,record){
            if(err){res.json(err);}
            else{
                friends=[];
                pending=[];
                all_friends=[];
                console.log("friends list: "+record);
                if(record.length > 0){
                    list=record[0].friends.slice();
                    console.log(list);
                    for(var i in list){
                        if(list[i].status=="Friend"){
                            friends.push(list[i].name);
                        }
                        else if (list[i].status=="Pending"){
                            
                            pending.push(list[i].name);
                        }
                        else{
                            continue;
                        }
                    }
                }
                
                console.log("pending list: "+pending);
                console.log("friends list: "+friends);
                io.to(socket.id).emit('friend_list', friends);
                io.to(socket.id).emit('pending_list', pending);
                io.emit('users',users);
            }
        });
        
        
        socket.on('group_chat',function(msg){
            console.log(msg);
            io.emit('group',msg);
        });
        
        socket.on('personal_chat',function(msg){
            console.log('message  :'+msg.split("#*@")[0]);
            models.messages.create({
                "message":msg.split("#*@")[1],
                "sender" :msg.split("#*@")[2],
                "reciever":msg.split("#*@")[0],
                "date" : new Date()});
            io.to(users[msg.split("#*@")[0]]).emit('personal_incoming', msg);
        });
        
        socket.on('disconnect', function(){
            delete users[keys[socket.id]];
            delete keys[socket.id];
            io.emit('users',users);
            console.log(users);
        });
    });
    
    app.post('/friend_request',function(req,res){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader("Access-Control-Allow-Method","'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
        friend=true;
        models.user.find({"handle" : req.body.my_handle,"friends.name":req.body.friend_handle},function(err,doc){
            if(err){res.json(err);}
            else if(doc.length!=0){
                console.log("Friend request : "+doc.length);
            }
            else{
                console.log("Friend request : "+doc.length);
                models.user.update({
                    handle:req.body.my_handle
                },{
                    $push:{
                        friends:{
                            name: req.body.friend_handle,
                            status: "Pending"
                        }
                    }
                },{
                    upsert:true
                },function(err,doc){
                    if(err){res.json(err);}
                    //            else{
                    //                console.log(doc);
                    //            }
                });
            }
            io.to(users[req.body.friend_handle]).emit('message', req.body);
        });
    });
    
    app.post('/friend_request/confirmed',function(req,res){
        console.log("friend request confirmed : "+req.body);
        if(req.body.confirm=="Yes"){
            models.user.find({
                "handle" : req.body.friend_handle,
                "friends.name":req.body.my_handle
            },function(err,doc){
                if(err){
                    res.json(err);
                }
                else if(doc.length!=0){
                    console.log("Friend request confirmed : "+doc.length);
                    console.log("Friend request confirmed : friend request already sent "+doc);
                    res.send("Friend request already accepted");
                }
                else{
                    models.user.update({
                        "handle":req.body.my_handle,
                        "friends.name":req.body.friend_handle
                    },{
                        '$set':{
                            "friends.$.status":"Friend"
                        }
                    },function(err,doc){
                        if(err){res.json(err);}
                        else{

                            console.log("friend request confirmed : Inside yes confirmed");
                            io.to(users[req.body.friend_handle]).emit('friend', req.body.my_handle);
                            io.to(users[req.body.my_handle]).emit('friend', req.body.friend_handle);
                        }
                    });
                    models.user.update({
                        handle:req.body.friend_handle
                    },{
                        $push:{
                            friends:{
                                name: req.body.my_handle,
                                status: "Friend"
                            }
                        }
                    },{upsert:true},function(err,doc){
                        if(err){res.json(err);}
                        //            else{
                        //                console.log(doc);
                        //            }
                    });
                }
            });
        }
        else{
            
            console.log("friend request confirmed : Inside declined");
            models.user.update({
                "handle":req.body.my_handle
            },{
                '$pull':{
                    'friends':{
                        "name":req.body.friend_handle,
                    }
                }
            },function(err,doc){
            if(err){res.json(err);}
            else{
                console.log("No");
            }
        });
        }
    });
    
}