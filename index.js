const { createEvent } = require('./createEvent');
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
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

// createEvent();

const PORT = process.env.PORT || 0;
const server = app.listen(PORT, () => {
	console.log(`app listening at http://localhost:${server.address().port})`);
});

server;
