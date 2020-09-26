const ics = require('ics');
const { writeFileSync } = require('fs');
const lodash = require('lodash');

//the below would normally be 'event'
const sampleEventPhoto = {
	text:
	'X Clinic - RO\nRun by: YY\n17/09 2020 20:38 32\nSchedule for: BLOGGS, K\nSchedule Dates: 21/09/2020 to 25/09/2020\nPatient ID - MRN: ABC123\nClinical Status: On Tx\nDate\nPri St Sts\nTime Dur Activity\n15:15 0:15 5733\nDescription\nQuinn IMRT\nDept\nGC\nLoc\nVER\n21/09/2020\nKM\n22/09/2020\n12:00 0:15 5733\nQuinn IMRT\nGC\nVER\nKM\n23/09/2020\n11:15 0:15 5733\nQuinn IMRT\nGC\nVER\nKM\n24/09/2020\n12:30 0:15 5733\nQuinn IMRT\nGC\nVER\nKM\n25/09/2020\n15:30 0:15 5733\nQuinn IMRT\nGC\nVER\nKM\nTotal Activities Scheduled:\n5',
	language: 'en',
};

//do the work to get all the dates, times, location, description information
const allDates = sampleEventPhoto.text.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
const dateRange = sampleEventPhoto.text.match(/\d{2}([\/.-])\d{2}\1\d{4}\s\w[to]\s\d{2}([\/.-])\d{2}\1\d{4}/g);
const dateRangeArray = dateRange[0].split(' to ');

const allTimes = sampleEventPhoto.text.match(/\d{2}([\:])\d{2}/g);
const allDescriptions = sampleEventPhoto.text.match(/Quinn IMRT/g);
const eachLineInArray = sampleEventPhoto.text.split('\n');
const replaceNewline = sampleEventPhoto.text.replace(/\n/g, ' ');
const totalNumberOfAppointments = replaceNewline.match(/Scheduled:* ([\d.]+)/)[1];
const relevantDates = allDates.filter(date => !dateRangeArray.includes(date));

//remove the first two dates which are the range - this needs steadying
//i am working off the unconfirmed assumption that the date range will
//always be the first two elements of the allDates array.
const appointmentDates = allDates.splice(2);


const formatTime = time => {
	const oneTime = time.split(':');
	formattedHour = oneTime[0];
	formattedMinute = oneTime[1];
	let result;
	if (formattedHour < 18) {
		result = [formattedHour, formattedMinute];
	}
	return {result};
}

//format the date to ics format
// { weeks, days, hours, minutes, seconds }
// [2000, 1, 5, 10, 0] (January 5, 2000)
const formatDate = date => {
	const oneDate = date.split('/');
	// being explicit here to make this more readable
	formattedDay = oneDate[0];
	formattedMonth = oneDate[1];
	formattedYear = oneDate[2];
	const formattedDateArray = [formattedYear, formattedMonth, formattedDay, '10', '10'];
	const result = formattedDateArray.map(function(x) {
		return parseInt(x, 10);
	});
	return result;
};

//start populating everything into an object for createEvent()
//another perhaps more readable way to do this
const populateEvent = new Object();
populateEvent.title = 'test';
populateEvent.description = 'description';
populateEvent.start = formatDate(allDates[0]);
populateEvent.duration = { minutes: 15 }
populateEvent.productId = 'mork';

let diaryEvents = [];
for (let i=0; i < appointmentDates.length; i++) {
	diaryEvents[i] = {
		title: '',
		description: '',
		start: formatDate(appointmentDates[i]),
		duration: { minutes: 15 },
		productId: 'mork',
	}
};
console.log(diaryEvents, 'what we get?');

//a sample event to test with
const sampleStockEvent =   {
	title: 'Lunch',
	start: formatDate(allDates[0]),
	duration: { minutes: 45 },
	productId: 'mork',
};

const { error, value } = ics.createEvents([
	populateEvent
	// sampleStockEvent
]);

if (error) {
  console.log(error)
  return
};

//what do we get when we run
console.log(value)

//ics file saved to folder
writeFileSync(`${__dirname}/events/event.ics`, value)

module.exports = { error, value };
