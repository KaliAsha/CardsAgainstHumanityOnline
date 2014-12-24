function Ticker(ds){
    this.ds = ds;

    this.interval = null;

    this.start = function(cb){
        if(this.interval==null) {
            this.interval = setInterval(this.tick, this.ds, cb);
        }else{
            cb(new Error('Ticker already started'));
        }
    };

    this.tick = function(cb){
        console.log("tick");
        cb(null);
    };

    this.stop = function(){
        clearInterval(this.interval);
    };
}