'use strict';

// temporary, just testing it out on my own slack
const token      = 'xoxb-50795597252-JqacfyYQVMJ1hqj2ASODm4s5' || '';
const Botkit     = require( 'botkit' );
const controller = Botkit.slackbot( {
	debug: false
} );


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
		// should listen to events here..
	} );
}

module.exports = Slackbot;