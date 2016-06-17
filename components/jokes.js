'use strict';

const request = require( 'request' );
const jokeAPI = 'http://tambal.azurewebsites.net/joke/random';

const Joke = {
	'getJoke' : getJoke
};

function getJoke () {
	return new Promise( function ( resolve, reject ) {
		request.get( jokeAPI, function ( err, res ) {
			if ( err ) {
				return reject( err );
			}
			var joke = JSON.parse( res.body ).joke;
			return resolve( joke );
		} );
	} );
}

module.exports = Joke;