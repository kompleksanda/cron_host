const cronstrue = require('cronstrue');
const later = require('later');

// cron schedules
// For this example, we'll assume the two cron expressions specify times at 
// an interval of 5 hours each day (* 5,10,15,20 * * * and * 0,5,10,15 * * *).
// These can be replaced with the actual cron expressions.
const cronExpression1 = "0 0 0 ? 1/3 6#5";
const cronExpression2 = "0 0 1-7 * 1";


const humanReadable1 = cronstrue.toString(cronExpression1);
const humanReadable2 = cronstrue.toString(cronExpression2);
console.log(humanReadable1)
console.log(humanReadable2)

// Parse the cron expressions to schedules
const schedule1 = later.parse.cron(cronExpression1);
const schedule2 = later.parse.cron(cronExpression2);

// Get the next occurrence of the first schedule
const nextOccurrence1 = later.schedule(schedule1).prev(1);
console.log(nextOccurrence1)

// Get the previous occurrence of the second schedule
const prevOccurrence2 = later.schedule(schedule2).next(1);
console.log(prevOccurrence2)

const currentDate = new Date();

// Check if the current date is between the two occurrences
if(currentDate >= nextOccurrence1 && currentDate <= prevOccurrence2) {
    console.log("The current date is between the two cron expressions!");
} else {
    console.log("The current date is not between the two cron expressions.");
}
