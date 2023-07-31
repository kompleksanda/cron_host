const express = require('express');
const app = express();
const port = 3000;
const cronstrue = require('cronstrue');
const later = require('later');

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
    const nextOccurrence1 = later.schedule(schedule1).prev(1);
    console.log(nextOccurrence1)

    // Get the previous occurrence of the second schedule
    const prevOccurrence2 = later.schedule(schedule2).next(1);
    console.log(prevOccurrence2)

    // Check if the current date is between the two occurrences
    if(currentDate >= nextOccurrence1 && currentDate <= prevOccurrence2) {
        console.log("The current date is between the two cron expressions!");
        return {
            status : true,
            nextDate: prevOccurrence2,
            alertDate: nextOccurrence1,
            happensEvery: humanReadable2
        }
    } else {
        console.log("The current date is not between the two cron expressions.");
        return {
            status: false
        }
    }
}

app.get('/equal/:param1/:param2?', (req, res) => {
    const { param1, param2 } = req.params;
    if (param2 !== undefined) {
        res.json(dateEqualsCron(param1, new Date(param2)));
        return;
    } else {
        res.json(dateEqualsCron(param1));
        return;
    }
});
  
app.get('/between/:param1/:param2/:param3?', (req, res) => {
    const { param1, param2, param3 } = req.params;
    if (param3 !== undefined) {
        res.send(dateInBetweenCrons(param1, param2, new Date(param3)));
        return;
    } else {
        res.send(dateInBetweenCrons(param1, param2));
        return;
    }
});
  
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



//console.log(dateEqualsCron("0 8 22-31 */3 *", new Date));
//console.log(dateInBetweenCrons("0 0 24-31 * *", "0 0 1-7 * 1", new Date));
