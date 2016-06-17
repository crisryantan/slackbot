'use strict';

/***
My data interpretation on using wolfram-alpha library
- result returns an array.
- result[ 0 ].title is equal to "Input interpretation". It is the query string on how wolfram api understands the question.
- If user asks a mathematical question, result[ 1 ].title is equal to "Result"
- If user asks an ordinary question, result[ 1 ].title is equal to "Definitions"
- If wolfram returns neither of this, result[ 1 ] is the NEAREST answer they could get of the users specific question.
- The rest of the objects returned in the array are just supporting data of the specific question like pictures,synonyms,antonyms,sounds like etc3.
	Since this is the case, I will only return result[ 1 ]. If the array.length is only equal to 1, I will return that wolfram has failed to get
	search results.
***/

const wolfram    = require( 'wolfram-alpha' ).createClient( 'L6Y49H-Q8P4JQPQYU' );
const Definition = {
	'getDefinition' : getDefinition
};

function getDefinition ( question ) {
	return new Promise( function ( resolve, reject ) {
		wolfram.query( question, function ( err, result ) {
			if ( err ) {
				return reject( err );
			}
			var definition = mapData( result );
			return resolve( definition );
		} );
	} );
}

function mapData ( result ) {
	if ( result.length > 1 ) {
		var definition = result[ 1 ].subpods[ 0 ].text;
		return definition;
	}
	return 'There are no search results available.';
}


module.exports = Definition;