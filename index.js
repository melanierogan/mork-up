const { error, value } = require('./createEvent');
const { writeFileSync } = require('fs');

//what do we get when we run
console.log(value);

//ics file saved to folder
writeFileSync(`${__dirname}/events/event.ics`, value);
