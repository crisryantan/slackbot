'use strict';

const PingClass = require( 'ping-lite' );

const IsDown = {
	'testWebsite' : testWebsite
};

function testWebsite ( URL ) {
	var ping = new PingClass( URL );
	return new Promise( function ( resolve, reject ) {
		ping.start( function ( err, ms ) {
			ping.stop();
			if ( err ) {
				return reject( err );
			}
			return resolve( URL + ' is up, responded in: ' + ms + ' ms.' );
		} );
	} );
}

module.exports = IsDown;