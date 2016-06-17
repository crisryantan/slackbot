'use strict';

const request  = require( 'request' );
const chuckAPI = 'https://api.chucknorris.io/jokes/random';

const Chuck = {
	'getFact' : getFact
};

function getFact () {
	return new Promise( function ( resolve, reject ) {
		request.get( chuckAPI, function ( err, res ) {
			if ( err ) {
				return reject( err );
			}
			var fact = JSON.parse( res.body ).value;
			return resolve( fact );
		} );
	} );
}


module.exports = Chuck;