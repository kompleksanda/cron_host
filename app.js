const cronstrue = require('cronstrue');
const later = require('later');
const moment = require('moment-timezone');

function changeTimezone(date, ianatz) {
    return new Date(date.toLocaleString('en-US', { timeZone: ianatz }));
}

// cron schedule
const cronExpression = "* * 21-28 * 5";

// Convert cron expression to human readable string
const humanReadable = cronstrue.toString(cronExpression);
console.log(humanReadable);

// Check if the current date/time matches the cron expression
const schedule = later.parse.cron(cronExpression);
const occurrences = later.schedule(schedule).prev(1);

const nextOccurrence = new Date(occurrences);
const currentDate = new Date();

// If the current date/time matches the cron expression
if(currentDate.getHours() === nextOccurrence.getHours() &&
   currentDate.getMinutes() === nextOccurrence.getMinutes() &&
   currentDate.getSeconds() === nextOccurrence.getSeconds()) {
    console.log("The cron expression matches the current date/time!");
} else {
    console.log("The cron expression does not match the current date/time.");
    console.log("Next occurrence is on: " + changeTimezone(nextOccurrence, "Africa/Lagos"));
}