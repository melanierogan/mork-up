const { createEvent } = require('./createEvent');
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const { processImage } = require('./convertImage');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const helpers = require('./helpers');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'public/images/');
	},

	// By default, multer removes file extensions so let's add them back
	filename: function(req, file, cb) {
		cb(
			null,
			file.fieldname + '-' + Date.now() + path.extname(file.originalname),
		);
	},
});

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', '.html');
app.set('views', __dirname + '/views');
const handlebarsInstance = exphbs.create({
	extname: '.html',
	defaultLayout: 'main',
});

app.engine('html', handlebarsInstance.engine);

app.get('/', (req, res) => {
	res.render('index.html');
});

app.post('/upload', async (req, res) => {
	let upload = multer({
		storage: storage,
		fileFilter: helpers.imageFilter,
	}).single('image_upload');

	upload(req, res, async function(err) {
		// req.file contains information of uploaded file
		// req.body contains information of text fields, if there were any

		if (req.fileValidationError) {
			return res.send(req.fileValidationError);
		} else if (!req.file) {
			return res.send('Please select an image to upload');
		} else if (err instanceof multer.MulterError) {
			return res.send(err);
		} else if (err) {
			return res.send(err);
		}

		// Display uploaded image for user validation
		const processUploadImage = req.file.path;
		const textResult = await processImage(processUploadImage);
		console.log(textResult, 'when i am ready');
		createEvent(textResult);
		const downloadIcs = '/public/events/event.ics';
		res.send(
			`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="${downloadIcs}">Download calendar file</a>`,
		);
	});
});

const PORT = process.env.PORT || 1000;
const server = app.listen(PORT, () => {
	console.log(`app listening at http://localhost:${server.address().port})`);
});

server;
