require('dotenv').config({
	silent: true,
});
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
	region: 'us-east-1',
});

const params = {
	Key: process.argv[2] || 'hello-env',
	Bucket: process.env.BUCKETEER_BUCKET_NAME,
	Body: new Buffer('Hello, node.js'),
};

s3.putObject(params, function put(err, data) {
	if (err) {
		console.log(err, err.stack);
		return;
	} else {
		console.log(data, 'this is the data');
	}

	delete params.Body;
	s3.getObject(params, function put(err, data) {
		if (err) console.log(err, err.stack);
		else console.log(data);

		console.log(data.Body.toString());
	});
});
