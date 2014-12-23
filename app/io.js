module.exports = function(io){
  var tracks = new Array();

  io.sockets.on('connection', function (socket) {
    var room;
    var address = socket.handshake.address;
    console.log("["+df.strftime(new Date(), '%T')+"] New connection from " + address.address);
    //console.log(io.sockets);

    socket.on('music_ready', function(){
      //socket.room = room;
      socket.emit('music_play');
    })

    socket.on('join_room', function(data){
      if(socket.room){
        socket.leave(socket.room);
      }
      socket.join(data.room_id);
      socket.room = data.room_id;
      console.log("["+df.strftime(new Date(), '%T')+"] "+ address.address + " joined room " + socket.room);
      global.rooms[socket.room].game.newGame();
    });

    var i = 0;

    socket.on('go', function(){
      //console.log(i);
      global.rooms[socket.room].game.startGame();
      var music = global.rooms[socket.room].game.playlist[i];
      console.log("["+df.strftime(new Date(), '%T')+"] Transmit \""+music.title+"\" by "+music.artist+" to "+ address.address + " in room " + socket.room);
      //console.log(global.rooms);
      socket.emit('music_received', {url:music.url});
      i++;
    });

    socket.on('submission', function(){
      
    })

    socket.emit('game', {'game_status':'RUNNING'});

    /*socket.on("join_room", function (data){
      socket.leave(socket.room);
      room = data.id;
      socket.join(room);
      socket.room = data.id;
      console.log("["+df.strftime(new Date(), '%T')+"] @"+data.user+" ("+address.address+") successfully joined "+data.id);
    });

    socket.on('message_sent', function(data){
      data.text = autolinker.link(data.text);
      socket.broadcast.to(room).emit('message_received', data);
      socket.emit('message_transmitted', data);
    })*/
  });
}