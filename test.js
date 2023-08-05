const cronstrue = require('cronstrue');
const later = require('later');
var moment = require('moment');

function changeTimezone(date, ianatz) {
    return new Date(date.toLocaleString('en-US', { timeZone: ianatz }));
}

function dateEqualsCron(cronExpression, currentDate = new Date) {
    // Convert cron expression to human readable string
    const humanReadable = cronstrue.toString(cronExpression);
    console.log(humanReadable);

    // Check if the current date/time matches the cron expression
    const schedule = later.parse.cron(cronExpression);
    const occurrences = later.schedule(schedule).next(1);

    const nextOccurrence = new Date(occurrences);
    // If the current date/time matches the cron expression
    if(currentDate.getHours() === nextOccurrence.getHours() &&
       currentDate.getMinutes() === nextOccurrence.getMinutes()-1) {
        console.log("The cron expression matches the current date/time!");
        return {
            status : true,
            happensEvery: humanReadable
        }
    } else {
        console.log("The cron expression does not match the current date/time.");
        console.log("Next occurrence is on: " + changeTimezone(nextOccurrence, "Africa/Lagos"));
        return {
            status : false
        }
    }
}

function dateInBetweenCrons(cronExpression1, cronExpression2, currentDate = new Date) {
    const humanReadable1 = cronstrue.toString(cronExpression1);
    const humanReadable2 = cronstrue.toString(cronExpression2);
    console.log(humanReadable1)
    console.log(humanReadable2)

    // Parse the cron expressions to schedules
    const schedule1 = later.parse.cron(cronExpression1);
    const schedule2 = later.parse.cron(cronExpression2);

    // Get the next occurrence of the first schedule
    const s1p = later.schedule(schedule1).prev(1);
    const s1n = later.schedule(schedule1).next(1);
    console.log(s1p)
    console.log(s1n)

    // Get the previous occurrence of the second schedule
    const s2n = later.schedule(schedule2).next(1);
    const s2p = later.schedule(schedule2).prev(1);
    console.log(s2n)
    console.log(s2p)
    console.log(currentDate);

    // Check if the current date is between the two occurrences
    if((currentDate >= s1p && currentDate <= s2n) && !(s1n >= s1p && s1n <= s2n)) {
        console.log("The current date is between the two cron expressions!");
        return {
            status : true,
            nextDate: s2n,
            alertDate: s1p,
            happensEvery: humanReadable2
        }
    } else {
        console.log("The current date is not between the two cron expressions.");
        return {
            status: false
        }
    }
}

function alertCron(alertBefore, cronExpression2, currentDate = new Date) {
    const humanReadable2 = cronstrue.toString(cronExpression2);
    console.log(humanReadable2)

    // Parse the cron expressions to schedules
    const schedule2 = later.parse.cron(cronExpression2);

    // Get the previous occurrence of the second schedule
    const s2n = later.schedule(schedule2).next(1);
    const s2p = later.schedule(schedule2).prev(1);
    console.log(s2n)

    beforeSplit = alertBefore.split(" ");
    var prevDate = moment(s2n).subtract(parseInt(beforeSplit[0]), beforeSplit[1]).toDate();

    // Check if the current date is between the two occurrences
    if (currentDate >= prevDate && currentDate <= s2n) {
        console.log("The current date is between deadline and alertdate");
        return {
            status : true,
            nextDate: s2n,
            alertDate: prevDate,
            happensEvery: humanReadable2
        }
    } else {
        console.log("The current date is not between deadline and alertdate");
        return {
            status: false
        }
    }
}

//console.log(dateEqualsCron("0 8 22-31 3,6,9,12 *"));//0 12 * * 1
//console.log(dateInBetweenCrons("0 8 22-31 * *", "0 8 1-14 * *", new Date));
console.log(alertCron("1 week", "0 0 8 ? * 1#1"))
