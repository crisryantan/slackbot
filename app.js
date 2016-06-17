'use strict';

const Hapi   = require( 'hapi' );
const server = new Hapi.Server();
const port   = process.env.port || 3000;

const slackbot = require( './slackbot.js' );

// connect to port
server.connection( { 'port' : port } );

server.start( function ( err ) {
	if ( !err ) {
		console.log( 'Server running at port: ' + port );
		slackbot.run();
		return;
	}
	console.log( 'An error occured' );
} );

