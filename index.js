const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(4000).sockets;


mongo.connect('mongodb://127.0.0.1/chat'), function(err,db){
    if(err){
        throw err;
    }
    console.log('mongo connected');
    
    // connect socket.io
    client.on('connection', function(socket){
        let chat =db.collection('chats');
        
        sendStatus = function(s) {
            socket.emit('status', s);
        }
   
    
    // get chat from collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err,res){
        if(err){
            throw err;
        }
        
        //Emit msg
        socket.emit('outpu, res');
    });
    //input event
    socket.on('input', function(data){
        let name =data.name;
        let message = data.message;
        
        //check name,msg
        if(name ==''|| message ==''){
            //err status
            sendStatus('Enter name and msg plz');
        }else{
            chat.insert({name:name, message:message, function(){
                client.emit('output',[data]);
           
            
            //send status
            sendStatus({
                message: "message Sent",
                clear:true
            });
            
            }});
        }
    });
    socket.on('clear', function(data){
        //remove chat
        chat.remove({},function(){
            socket.emit('cleared');
        });
    });
 
 });
});