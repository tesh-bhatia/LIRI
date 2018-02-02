require("dotenv").config();

var keys = require('./keys'),
    Twitter = require('twitter')
    Spotify = require('node-spotify-api'),
    request = require('request'),
    fs = require('fs');

var command = process.argv[2],
    searchTerm = process.argv[3];

doCommand(command, searchTerm)

function doCommand (command, searchItem) {
    switch(command){
        case 'my-tweets':
            console.log('Getting tweets...')
            getTweets();
            break;
        case 'spotify-this-song':
            console.log('Searching spotify...')
            spotifySong(searchItem)
            break;
        case 'movie-this':
            console.log('Searching for movie...')
            movieThis(searchItem)
            break;
        case 'do-what-it-says':
            console.log('Reading file...')
            readTheFile();
            break;
        default:
            console.log('"' + command + '" is not a valid argument. Please try again.')
    }
}

function getTweets () {
    var client = new Twitter(keys.twitter);
    client.get('statuses/user_timeline', function(error, tweets, response){
        if(error){
            return console.log(error)
        }

        logResults('\nCommand: ' + command + '\n')

        tweets.forEach(function(tweet){
            console.log('* ' + tweet.text)
            logResults('* ' + tweet.text + '\n')
        })
    })
}

function spotifySong(searchItem){
    var spotify = new Spotify(keys.spotify)
    var query = searchItem ? searchItem : 'The Sign',
        trackNum = searchItem ? 0 : 5 //done in order to get song by Ace of Bass
    var secondArg = searchTerm ? searchTerm : '' //accurately log command line entry

    spotify.search({ type: 'track', query: query }, function(err, data) {
        if (err) {
        return console.log('Error occurred: ' + err);
        }

    var track = data.tracks.items[trackNum]

    var album = track.album.name;
    var artist = track.artists[0].name;
    var ext_url = track.external_urls.spotify;
    var song = track.name;
    var result = '* ' + artist + '\n* ' + song + '\n* ' + ext_url + '\n* ' + album 
    + '\n'
    console.log(result); 
    logResults('\nCommand: ' + command + ' ' + secondArg + '\n' + result)
    });
}

function movieThis(searchItem){
    var movie = searchItem ? searchItem : "Remember%20the%20Titans" //I hated Mr. Nobody so we're not using that shit
    var endpoint = 'https://www.omdbapi.com/?apikey=trilogy&t=' + movie
    var secondArg = searchTerm ? searchTerm : '' //accurately log command line entry

    console.log(endpoint);

    request.get(endpoint, function(err, res, body){
        if(err){
            return console.log(err)
        }

        body = JSON.parse(body) //turn string response to JSON so it can be referenced
        var result = '* ' + body.Title + '\n' +
        '* ' + body.Year + '\n' +
        '* IMDB rating: ' + body.Ratings[0].Value + '\n' +
        '* Rotten Tomatoes rating: ' + body.Ratings[1].Value + '\n' +
        '* ' + body.Country + '\n' +
        '* ' + body.Language + '\n' +
        '* ' + body.Plot + '\n' +
        '* ' + body.Actors + '\n'

        console.log(result)
        logResults('\nCommand: ' + command + ' ' + secondArg + '\n' + result)
    })
}

function readTheFile () {
    fs.readFile('random.txt', 'utf-8', function(error, data){
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(',')
        var comm = dataArr[0]
        var search = dataArr[1]

        doCommand(comm, search)
    })
}

function logResults (text) {
    fs.appendFile('log.txt', text, function(err){
        if(err){
            return console.log(error)
        }

        console.log("Log updated!")
    } )
}