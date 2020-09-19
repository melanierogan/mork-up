const ics = require('ics');
const { writeFileSync } = require('fs');

const { error, value } = ics.createEvents([
  {
    title: 'Lunch',
    start: [2018, 1, 15, 12, 15],
    duration: { minutes: 45 }
  },
  {
    title: 'Dinner',
    start: [2018, 1, 15, 12, 15],
    duration: { hours: 1, minutes: 30 }
  }
])

if (error) {
  console.log(error)
  return
}

console.log(value)
writeFileSync(`${__dirname}/events/event.ics`, value)

module.exports = {error, value};
