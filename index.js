const optiic = new (require('optiic'))({
	apiKey: 'api_test_key', // Not required, but having one removes limits (get your key at https://optiic.dev).
});

let options = {
	image: 'https://rolfscountryhouse.com/wp-content/uploads/2015/11/rolfs-menu-1.jpg', // url of the image
	mode: 'ocr', // ocr
};

optiic.process(options).then(result => {
	console.log(result);
});
