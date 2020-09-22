const optiic = new (require('optiic'))({
	apiKey: '', // Not required, but having one removes limits (get your key at https://optiic.dev).
});

let options = {
	image: './images/test5.JPG', // url of the image
	mode: 'ocr', // ocr
};

optiic.process(options).then(result => {
	console.log(result);
});
