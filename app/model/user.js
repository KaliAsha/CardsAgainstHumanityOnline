var PlayerState = require('./enums/playerstate.json');

function User(args, cb){
    this._id = parseInt(args._id);
    this.token = args.token;
    this.tokenSecret = args.tokenSecret;
    this.name = args.name;
    this.username = args.username;
    this.avatar = args.avatar;

    console.log(this._id, typeof this._id);

    /*this.game = {
        cards: new Array(),
        score: 0,
        state: PlayerState.PLAYER
    }*/

    var self = this;

    global.mongo.collections.users.findById(this._id, function(error, results) {
        if(!results){
            self.stats = {
                playedGames : 0,
                wonGames : 0
            };
        }else{
            self.stats = results.stats;
        }

        self.save(cb);
    });
}

User.prototype.save = function(cb){
    var data = {
        _id: this._id,
        token: this.token,
        tokenSecret: this.tokenSecret,
        name: this.name,
        username: this.username,
        avatar: this.avatar,
        stats: this.stats
    };

    var self = this;

    global.mongo.collections.users.save(data, function(error, results) {
        //console.log(results);
        if(!error){
            console.log(global.df.logtime()+" @"+self.username+" saved in db");
            if(cb){cb(null, self)};
        }else{
            //console.log(error);
            if(cb){cb(error, null)};
        }
    });
}

module.exports = User;