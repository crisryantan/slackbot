'use strict';

const token      = process.env.slacktoken || '';
const Botkit     = require( 'botkit' );
const controller = Botkit.slackbot( {
	debug: false
} );

const JokeApi  = require( './components/jokes.js' );

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
		// For reference: https://github.com/howdyai/botkit/blob/master/readme-slack.md#message-received-events
		controller.hears( [ 'tell a joke' ], 'direct_mention,ambient', function( bot, message ) {
			JokeApi.getJoke().then( function ( joke ) {
				bot.reply( message, joke );
			} );
		} );
	} );
}

module.exports = Slackbot;
