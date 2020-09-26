const ics = require('ics');
const { processImage } = require('./convertImage');
const { writeFileSync } = require('fs');

const createEvent = async () => {
	try {
		console.log('>>>> NOW TRYING <<<<<<<');
		const resolved = await processImage;
		console.log(resolved, 'what we get');
		//do the work to get all the dates, times, location, description information
		const allDates = resolved.text.match(/\d{2}([\/.-])\d{2}\1\d{4}/g);
		const dateRange = resolved.text.match(
			/\d{2}([\/.-])\d{2}\1\d{4}\s\w[to]\s\d{2}([\/.-])\d{2}\1\d{4}/g,
		);
		const dateRangeArray = dateRange[0].split(' to ');

		const allTimes = resolved.text.match(/\d{2}([\:])\d{2}/g);
		const allDescriptions = resolved.text.match(/Quinn IMRT/g);
		const eachLineInArray = resolved.text.split('\n');
		const replaceNewline = resolved.text.replace(/\n/g, ' ');
		const totalNumberOfAppointments = replaceNewline.match(
			/Scheduled:* ([\d.]+)/,
		)[1];
		const relevantDates = allDates.filter(
			date => !dateRangeArray.includes(date),
		);

		//i am working off the unconfirmed assumption that the date range will
		//always be the first two elements of the allDates array.
		const appointmentDates = allDates.splice(2);
		const appointmentTimes = allTimes.splice(1);

		const formatTime = time => {
			const oneTime = time.split(':');
			formattedHour = oneTime[0];
			formattedMinute = oneTime[1];
			let result;
			if (formattedHour < 18) {
				let formattedArray = [formattedHour, formattedMinute];
				result = formattedArray.map(function(x) {
					return parseInt(x, 10);
				});
			}
			return result;
		};

		let formattedTimes = [];
		for (let index = 0; index < appointmentTimes.length; index++) {
			const element = appointmentTimes[index];
			let result = formatTime(element);
			formattedTimes.push(result);
		}

		//format the date to ics format
		// { weeks, days, hours, minutes, seconds }
		// [2000, 1, 5, 10, 0] (January 5, 2000)
		const formatDate = (date, time) => {
			const oneDate = date.split('/');
			// being explicit here to make this more readable
			formattedDay = oneDate[0];
			formattedMonth = oneDate[1];
			formattedYear = oneDate[2];
			const formattedDateArray = [formattedYear, formattedMonth, formattedDay];
			const result = formattedDateArray.map(function(x) {
				return parseInt(x, 10);
			});
			return result;
		};

		let formattedDates = [];
		for (let index = 0; index < appointmentDates.length; index++) {
			const element = appointmentDates[index];
			let result = formatDate(element);
			formattedDates.push(result.concat(formattedTimes[index]));
		}

		let diaryEvents = [];
		for (let i = 0; i < appointmentDates.length; i++) {
			diaryEvents[i] = {
				title: 'Hospital Appointment',
				description: allDescriptions[i],
				start: formattedDates[i],
				//ideally below will not be hardcoded
				duration: { minutes: 15 },
				productId: 'mork',
			};
		}

		const { error, value } = ics.createEvents(diaryEvents);
		console.log(value, 'i dunno');

		if (error) {
			console.log(error);
			return;
		}

		//what do we get when we run
		console.log(value)
		writeFileSync(`${__dirname}/events/event.ics`, value);
	} catch (error) {
		console.log(error);
	}
};

module.exports = { createEvent };
