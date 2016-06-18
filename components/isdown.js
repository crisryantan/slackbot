'use strict';

const PingClass = require( 'ping-lite' );

const IsDown = {
	'testWebsite': testWebsite
};

// sadly this is only working in local, it could have return response time. I have an unknown defect
// when integrating with heroku where it shut downs the bot when method is called

function testWebsite ( URL ) {
	var ping = new PingClass( URL );
	return new Promise( function ( resolve, reject ) {
		ping.start( function ( err, ms ) {
			ping.stop();
			if ( err ) {
				return reject( err );
			}
			if ( ms ) {
				return resolve( URL + ' is up, responded in: ' + ms + ' ms.' );
			}

			return resolve( URL + ' is up.' );
		} );
	} );
}

module.exports = IsDown;
