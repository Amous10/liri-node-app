require("dotenv").config(); //node package to read private files
var keys = require("./keys.js"); // Grab data from keys.js
var fs = require("fs"); // node package for reading and writing files
var Spotify = require("node-spotify-api"); // node package that handles Spotify requests
var axios = require("axios"); //node package for axios
var moment = require("moment");

//Prompts for command line syntax
// Store all of the arguments in an array

var command = process.argv[2];
var value = process.argv.slice(3).join(' ');
// var searchValue = ""; //movie or song or band

function switchCase() {
    switch (command) {
        case "concert-this":
            concertThis(value);
            break;
        case "spotify-this-song":
            if (value) {
                spotifyThis(value);
            } else {
                spotifyThis("The Sign by Ace of Base");
            }
            break;
        case "movie-this":
            if (value) {
                movieThis(value);
            } else {
                movieThis("Mr Nobody");
            }
            break;
        case "do-what-it-says":
            randomSearch(value);
            break;
        default:
            console.log("\nEnter: node liri.js do-what-it-says or movie-this (w movie title following) or spotify-this-song (w song title) or concert-this (band/artist name),  \n");
    };
};

function spotifyThis(song) {
    var spotify = new Spotify(keys.spotify);
    spotify.search({
        type: 'track',
        query: song
    }, function (error, data) {
        if (error) {
            console.log('Error occurred.');
        } else {
            for (var i = 0; i < data.tracks.items.length; i++) {

                var songData = data.tracks.items[i];
                console.log("-----------------------");
                //artist
                console.log("Artist: " + songData.artists[0].name);
                //song name
                console.log("Song: " + songData.name);
                //spotify preview link
                console.log("Preview URL: " + songData.preview_url);
                //album name
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");

                //adds text to log.txt
                fs.appendFileSync('log.txt', songData.artists[0].name);
                fs.appendFileSync('log.txt', songData.name);
                fs.appendFileSync('log.txt', songData.preview_url);
                fs.appendFileSync('log.txt', songData.album.name);
                fs.appendFileSync('log.txt', "-----------------------");
            };
        };

    });
};


function concertThis(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(
        function (response) {
            if (response.data[0].venue != undefined) {
                console.log(queryUrl);
                console.log("-----------------------");
                console.log("Event Artist: " + response.data[0].lineup[0]);
                console.log("Event Venue: " + response.data[0].venue.name);
                console.log("Event Location: " + response.data[0].venue.city);
                var momentDT = moment(response.data[0].datetime);
                console.log("Event Date & Time: " + momentDT.format("dddd, MMMM Do YYYY"));
                console.log("-----------------------");

                //adds text to log.txt
                fs.appendFileSync('log.txt', response.data[0].lineup[0]);
                fs.appendFileSync('log.txt', response.data[0].venue.name);
                fs.appendFileSync('log.txt', response.data[0].venue.city);
                fs.appendFileSync('log.txt', momentDT.format("dddd, MMMM Do YYYY"));
                fs.appendFileSync('log.txt', "-----------------------");

            } else {
                console.log("No results found.");
            };
        }
    );
}

function movieThis(movie) {

    // Then run a request with axios to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&apikey=trilogy";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    axios.get(queryUrl).then(

        function (response) {
            if (response.data.Title != undefined) {
                console.log(queryUrl)
                console.log("-----------------------");
                // Title
                console.log("Title: " + response.data.Title);
                // Year the movie came out
                console.log("Year: " + response.data.Year);
                //IMDB Rating
                console.log("imdbRating:: " + response.data.imdbRating);
                //Country
                console.log("Country:: " + response.data.Country);
                //Language
                console.log("Language:: " + response.data.Language);
                //Plot
                console.log("Plot: " + response.data.Plot);
                //Actors
                console.log("Actors: " + response.data.Actors);
                //Rotten Tomatoes
                console.log("RottenTomatoes: " + response.data.tomatoRating);
                console.log("-----------------------");
            } else {
                console.log("No results found.");
            }
        });
}

//create function do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// Edit the text in random.txt to test out the feature for movie-this and concert-this.
function randomSearch(newArr) {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        console.log(data);
        

        const newArr = data.split(",");
        comm = newArr[0];
        val = newArr[1];
        console.log(newArr)
        // Calls main controller to do something based on action and argument.
        switchCase(comm, val);
        // fs.appendFile("log.txt, ")//writes to log.txt
    });
   
}
