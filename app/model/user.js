var PlayerState = require('./enums/playerstate.json');

function User(id, name, author, visibility){
    this._id = id;
    this.name = name;
    this.username = username;
    this.avatar = avatar;
    this.stats = {
        playedGames : 0,
        wonGames : 0
    };

    this.game = {
        cards : new Array(),
        score : 0,
        state : PlayerState.PLAYER
    }

    this.COLLECTION = "users";
}

User.prototype.save = function(){
    var collec = globals.mongo.collection(this.COLLECTION);

    var data = {
        _id: this.id,
        name: this.name,
        username: this.username,
        avatar: this.avatar,
        stats: this.stats
    };

    collec.save(data, function(error, results) {
        // Returns a new document (array).
        console.log(results);
    });
}

module.exports = User;