const optiic = new (require('optiic'))({
	apiKey: 'api_adedc6b7-f043-45ce-b718-5701311741da', // Not required, but having one removes limits (get your key at https://optiic.dev).
});

let options = {
	image: './images/test4.JPG', // url of the image
	mode: 'ocr', // ocr
};

optiic.process(options).then(result => {
	console.log(result);
});
