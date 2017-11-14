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

			var isBase64Encoded = false;
			if ( data.ContentType.indexOf('image/') > -1 ) {
				isBase64Encoded = true;
			}

			var encoding = '';
			if ( isBase64Encoded ) {
				encoding = 'base64'
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
