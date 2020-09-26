const optiic = new (require('optiic'))({
	apiKey: 'api_adedc6b7-f043-45ce-b718-5701311741da', // Not required, but having one removes limits (get your key at https://optiic.dev).
});

let options = {
	image: './images/test5.JPG',
	// image: 'https://via.placeholder.com/468x60?text=Sample+text',
	mode: 'ocr', // ocr
};

let processImage = optiic.process(options).then(result => {
	return result;
});

module.exports = { processImage };
