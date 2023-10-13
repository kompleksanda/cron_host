function processSheetData() {
  var spreadsheetId = '10_B4-SQggcH6T8unSOrDSpU-4NJYHrEWWIuVCoZ6VKE';
  var range = 'Sheet1!A:R';
  var valueRenderOption = 'UNFORMATTED_VALUE';

  var response = Sheets.Spreadsheets.Values.get(spreadsheetId, range, {
    valueRenderOption: valueRenderOption
  });

  var values = response.values;
  var headerRow = values[0];
  var cronStartIndex = headerRow.indexOf('Alert before');
  var cronEndIndex = headerRow.indexOf('Cron End');
  var descriptionIndex = headerRow.indexOf('Description');
  var taskIndex = headerRow.indexOf('Task');
  var linkIndex = headerRow.indexOf('Link');

  for (var i = 1; i < values.length; i++) {
    var rowData = values[i];
    var currentCronStartData = rowData[cronStartIndex];
    var currentCronEndData = rowData[cronEndIndex];
    var currentDescriptionData = rowData[descriptionIndex];
    var currentTaskData = rowData[taskIndex];
    var currentLinkData = rowData[linkIndex];

    Logger.log(currentTaskData);
    var data = JSON.parse(cronTask(currentCronStartData, currentCronEndData));
    Logger.log(data);
    if (data.status === true) {

        if (currentLinkData === "Application") {
          var emailBody = currentTaskData + '\n\n';
          emailBody += 'Expires ' + data.happensEvery + '\n\n';
          emailBody += 'Latest deadline on ' + data.nextDate + '\n\n';
          emailBody += 'DESCRIPTION:' + '\n';
          emailBody += currentDescriptionData + '\n';
          var recipientEmail = 'alexander.akinyomola@up-ng.com, nosa.anderson@up-ng.com';
          var subject = 'License Expiry ALERT! ' + currentTaskData;
        } else {
          var emailBody = currentTaskData + '\n\n';
          emailBody += 'Happens ' + data.happensEvery + '\n\n';
          emailBody += 'Current alert is ' + data.alertDate + '\n';
          emailBody += 'Latest deadline on ' + data.nextDate + '\n\n';
          emailBody += 'DESCRIPTION:' + '\n';
          emailBody += currentDescriptionData + '\n';
          var recipientEmail = 'alexander.akinyomola@up-ng.com';
          var subject = 'KPI TASK ALERT! ' + currentTaskData;
        }
        GmailApp.sendEmail(recipientEmail, subject, emailBody);
    }
  }
}

function cronBetween(cronStart, cronEnd, currentDate = new Date) {
  let cron1 = encodeURIComponent(cronStart);
  let cron2 = encodeURIComponent(cronEnd);
  //let date = encodeURIComponent(currentDate.toISOString());
  let url = `https://kpi-hg4x.onrender.com/between/${cron1}/${cron2}/${currentDate}`;
  return UrlFetchApp.fetch(url).getContentText();
}


function cronTask(alertBefore, cronEnd, currentDate = new Date) {
  let cron1 = encodeURIComponent(alertBefore);
  let cron2 = encodeURIComponent(cronEnd);
  //let date = encodeURIComponent(currentDate.toISOString());
  let url = `https://kpi-hg4x.onrender.com/alertCron/${cron1}/${cron2}/${currentDate}`;
  return UrlFetchApp.fetch(url).getContentText();
}

function cronEqual(cronStart, currentDate = new Date) {
  let cron = encodeURIComponent(cronStart);
  let date = encodeURIComponent(currentDate.toISOString());
  let url = `https://kpi-hg4x.onrender.com/equal/${cron}/${date}`;
  return UrlFetchApp.fetch(url).getContentText();
}
//console.log(cronEqual("0 8 22-31 */3 *"));
//console.log(cronBetween("0 8 22-31 */3 *", "0 8 22-31 */4 *"));
