var Visibility = require('./enums/visibility.json');

function Room(id, name, author, visibility){
    this._id = id;
    this.name = name;
    this.game = new GameManager();
    this.creatorId = creatorId || null;
    this.visibility = visibility || Visibility.PUBLIC;
    this.creationDate = date || new Date();
    this.game = null;
    this.players = new Array();

    this.COLLECTION = "rooms";
}

Room.prototype.save = function(){
    var collec = globals.mongo.collection(this.COLLECTION);

    var data = {
        _id: this.id,
        name: this.name,
        creatorId: this.creatorId,
        visibility: this.visibility,
        creationDate: this.creationDate
    };

    collec.save(data, function(error, results) {
        // Returns a new document (array).
        console.log(results);
    });
}

module.exports = Room;