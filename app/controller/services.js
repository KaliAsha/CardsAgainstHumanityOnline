var request = require('request-json');
var Track = require('../model/track.js');

var services = (function() {
	'use strict';

	var instance;

	services = function(args) {
		if (instance) {
			return instance;
		}

		instance = this;

		var api = request.newClient('http://api.deezer.com/');
		this.getTracks = function(apiId, cb){
			api.get('playlist/'+apiId, function (err, res, body) {
				var tracks = [];
				//console.log('[API]', body.tracks.data);
				for (var i in body.tracks.data) {
					if (body.tracks.data.hasOwnProperty(i)) {
				       	var track = body.tracks.data[i];
						tracks.push(new Track(track.preview, track.title, track.artist.name));
				   	}
				}
			 	cb(tracks);
			});
		}
	};

	return services;

}());

module.exports = new services;
