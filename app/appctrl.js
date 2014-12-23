var rooms_in = require('./config/rooms.json');

var Room = require('./model/room.js');
global.rooms = {};

for(var key in rooms_in) {
	var room = new Room(
		key,
		rooms_in[key].name,
		rooms_in[key].api_id
	);
	(function(room){
		room.updateTracks(function(){
			console.log("["+df.strftime(new Date(), '%T')+"] Playlist of room \""+room.id+"\" successfully updated");
			//console.log(room.tracks);
		})
	})(room);
	//setTimeout(function(){console.log(room);},5000);
	//console.log(room);
	global.rooms[key] = room;
}
//setTimeout(function(){console.log(global.rooms['top50']);},5000);