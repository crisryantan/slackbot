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

const http = require( 'http' );

var urlRegex       = new RegExp( /([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&\/=]*)/);
var urlRegexString = /(is\s*(.+\.\w\w.*)\sdown?)/;

var Slackbot = {
	'run': run
};

function run () {
	controller.spawn( {
		'token': token
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
		var userMsg      = message.text;
		var userUrl      = urlRegex.exec( message.text )[ 0 ];
		var userUrlQuery = 'http://www.' + userUrl;
		http.get( userUrlQuery, function () {
			bot.reply( message, userUrl + ' is up.' );
		} ).on( 'error', function () {
			bot.reply( message, userUrl + ' is down.' );
		} );

		// sadly this is only working in local, could have return response time. I have an unknown defect
		// when integrating with heroku where it shut downs the bot when method is called
		/*
		 IsDownApi.testWebsite( userUrl[ 0 ] ).then( function ( report ) {
		 	bot.reply( message, report );
		 } );
		*/
	} );
}


module.exports = Slackbot;
