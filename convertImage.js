require('dotenv').config({
	silent: true,
});

const optiic = new (require('optiic'))({
	apiKey: process.env.OPTIIC_API_KEY, // Not required, but having one removes limits (get your key at https://optiic.dev).
});

const processImage = async image => {
	let options = {
		image: `./${image}`,
		mode: 'ocr', // ocr
	};
	try {
		const result = await optiic.process(options);
		console.log(result, 'the image text');
		return result;
	} catch (error) {
		console.log(error);
	}
};

module.exports = { processImage };
