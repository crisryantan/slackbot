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


module.exports = Slackbot;
