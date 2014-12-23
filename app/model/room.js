//console.log(api);
var services = require('../controller/services.js');
var opts = require('../config/opts.json');
var GameManager = require('./gamemanager.js');
var mongoose = require('mongoose');
var Visibility = require('./enums/visibility.json');

function Room(id, name, apiId, author, visibility){
    this.id = id;
    this.name = name;
    this.apiId = apiId;
    this.game = new GameManager();
    this.players = [];
    this.author = author || null;
    this.checksum = null;
    this.visibility = visibility || Visibility.PUBLIC;
    this.note = 5;
    //console.log(this);
}

Room.prototype.updateTracks = function(callback){
    var _this = this;
    services.getTracks(this.apiId, function(tracks){
        _this.game.setTracks(tracks);
        callback();
    });
}

module.exports = Room;