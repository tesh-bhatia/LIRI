require("dotenv").config();

var keys = require('./keys');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify)

spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

   var album = data.tracks.items[0].album.name;
   var artist = data.tracks.items[0].artists[0].name;
   var ext_url = data.tracks.items[0].external_urls.spotify;
   var song = data.tracks.items[0].name;
  console.log(album, artist, song, ext_url); 
  });