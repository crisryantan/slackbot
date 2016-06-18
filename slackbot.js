'use strict';

const token      = process.env.slacktoken || '';
const Botkit     = require( 'botkit' );
const controller = Botkit.slackbot( {
	debug: false
} );

// component api's
const JokeApi       = require( './components/jokes.js' );
const ChuckApi      = require( './components/chuck.js' );
const DefinitionApi = require( './components/definition.js' );
const IsDownApi     = require( './components/isdown.js' );

// http://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url/3809435#3809435
var urlRegex       = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&/ /= ]*)/;
// just referencing this regex http://codegolf.stackexchange.com/a/479 and added "is" and "down" to the pattern
// weird that /(is\s*([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&/ /= ]*))\sdown?)/ does not work but works on regex101 so i'll use this instead
var urlRegexString = /(is\s*(.+\.\w\w.*)\sdown?)/;

var Slackbot = {
	'run': run
};

function run () {
	controller.spawn( {
		'token': token,
	} ).startRTM( function ( err ) {
		if ( err ) {
			throw new Error( 'Could not connect to Slack' );
		}
		listenToEvents();
	} );
}

function listenToEvents () {
	// For reference: https://github.com/howdyai/botkit/blob/master/readme-slack.md#message-received-events
	jokeEvent();
	chuckNorrisEvent();
	defineQuestionEvent();
	isWebsiteDownEvent();
}

function jokeEvent () {
	controller.hears( [ 'tell a joke' ], 'direct_mention,ambient', function( bot, message ) {
		JokeApi.getJoke().then( function ( joke ) {
			bot.reply( message, joke );
		} );
	} );
}

function chuckNorrisEvent () {
	controller.hears( [ 'do you know chuck norris?' ], 'direct_mention,ambient', function( bot, message ) {
		ChuckApi.getFact().then( function ( fact ) {
			bot.reply( message, fact );
		} );
	} );
}

function defineQuestionEvent () {
	controller.hears( [ /what is [a-z]+(?: [a-z]+)*\?/ ], 'direct_mention,ambient', function( bot, message ) {
		DefinitionApi.getDefinition( message.text ).then( function ( definition ) {
			bot.reply( message, definition );
		} );
	} );
}

function isWebsiteDownEvent () {
	controller.hears( [ urlRegexString ], 'direct_mention,ambient', function( bot, message ) {
		var userUrl = urlRegex.exec( message.text )
		IsDownApi.testWebsite( userUrl[ 0 ] ).then( function ( report ) {
			bot.reply( message, report );
		} );
	} );
}


module.exports = Slackbot;
