var AWS = require('aws-sdk');

module.exports = function( region, bucket, key, callback ) {
	var s3 = new AWS.S3(
		Object.assign( { region: region } )
	);
	return s3.makeUnauthenticatedRequest(
		'getObject',
		{
			Bucket: bucket,
			Key: key
		},
		function( err, data ) {
			if ( err ) {
				return callback( err );
			}

			var contentTypeParts = data.ContentType.split('/');
			var frontPart = contentTypeParts[0];
			var backPart = contentTypeParts[1];
			var isBase64Encoded = true;
			if ( frontPart == 'text' ) {
				isBase64Encoded = false;
			}
			if ( frontPart == 'image' && backPart == 'svg+xml' ) {
				isBase64Encoded = false;
			}
			if ( frontPart == 'application' ) {
				switch( backPart ) {
					case 'javascript':
					case 'json':
					case 'atom+xml':
					case 'ld+json':
					case 'rss+xml':
					case 'vnd.geo+json':
					case 'xml':
					case 'rtf':
					case 'xhtml+xml':
					case 'xslt+xml':
						isBase64Encoded = false;
						break;
				}
			}

			var encoding = '';
			if ( isBase64Encoded ) {
				encoding = 'base64';
			}
			var resp = {
				statusCode: 200,
				headers: {
					'Content-Type': data.ContentType,
				},
				body: new Buffer(data.Body).toString(encoding),
				isBase64Encoded: isBase64Encoded
			};

			callback( null, resp );
		}
	);
};
