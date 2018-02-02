require("dotenv").config();

var keys = require('./keys'),
    Spotify = require('node-spotify-api'),
    request = require('request');

var command = process.argv[2],
    searchItem = process.argv[3];

switch(command){
    case 'my-tweets':
        console.log('Getting tweets...')
        break;
    case 'spotify-this-song':
        console.log('Searching spotify...')
        spotifySong()
        break;
    case 'movie-this':
        console.log('Searching for movie...')
        movieThis()
        break;
    case 'do-what-it-says':
        console.log('Reading file...')
        break;
}

function spotifySong(){
    var spotify = new Spotify(keys.spotify)
    var query = searchItem ? searchItem : 'The Sign',
        trackNum = searchItem ? 0 : 5 //done in order to song by Ace of Bass


    spotify.search({ type: 'track', query: query }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }

    var track = data.tracks.items[trackNum]

    var album = track.album.name;
    var artist = track.artists[0].name;
    var ext_url = track.external_urls.spotify;
    var song = track.name;
    console.log(artist + '\n' + song + '\n' + ext_url + '\n' + album); 
    });
}

function movieThis(){
    var movie = searchItem ? searchItem : "Remember%20the%20Titans" //I hated Mr. Nobody so we're not using that shit
    var endpoint = 'https://www.omdbapi.com/?apikey=trilogy&t=' + movie

    console.log(endpoint);

    request.get(endpoint, function(err, res, body){
        if(err){
            return console.log(err)
        }

        body = JSON.parse(body) //turn string response to JSON so it can be referenced
        
        console.log(
            '* ' + body.Title + '\n' +
            '* ' + body.Year + '\n' +
            '* IMDB rating: ' + body.Ratings[0].Value + '\n' +
            '* Rotten Tomatoes rating: ' + body.Ratings[1].Value + '\n' +
            '* ' + body.Country + '\n' +
            '* ' + body.Language + '\n' +
            '* ' + body.Plot + '\n' +
            '* ' + body.Actors + '\n')
    })
}