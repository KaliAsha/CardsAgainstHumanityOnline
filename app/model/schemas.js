var mongoose = require('mongoose');

var gameManagerSchema = new mongoose.Schema({
	tracks : [trackSchema],
	trackscount : Number,
	playlist 
})

gameManagerSchema

var roomSchema = new mongoose.Schema({
    id : String,
    name : String,
    apiId : Number,
    game : gameManagerSchema,
    players : [userSchema],
    author : userSchema,
    checksum : String,
    visibility : { type: Number, min: 0, max: 2, default: 0 }
})

roomSchema.methods.updateTracks = function(callback){
    var _this = this;.
    services.getTracks(this.apiId, function(tracks){
        _this.game.setTracks(tracks);
        callback();
    });
}

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;