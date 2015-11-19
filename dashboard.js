function updateMessage_Upcoming() {
  // Customer Dashboard spreadsheet
  var ss_customerDashboard = SpreadsheetApp.openById('googlesheets_id');
  // Automessenger spreadsheet
  var ss_messenger = SpreadsheetApp.openById('googlesheets_id');  
  
  var finalMessage = "*Outstanding Assignments:* \n";
  Logger.log(customerDashboard_getLastRow_Upcoming(ss_customerDashboard));

  // try and run for recurring messenger
  try {
    for (var j=2; j < re_getLastRow(ss_messenger)+1; j++) {
      if (ss_messenger.getSheetByName('Recurring Messenger').getRange(j, 7).getValue() == "all") {
        for (var i=2; i < customerDashboard_getLastRow_Upcoming(ss_customerDashboard)+1; i++) {
          var customerName = ss_customerDashboard.getSheetByName("Upcoming assignments").getRange(i, 2).getValue();
          var assignmentName = ss_customerDashboard.getSheetByName("Upcoming assignments").getRange(i, 3).getValue();
          var assignmentDueDate = ss_customerDashboard.getSheetByName("Upcoming assignments").getRange(i, 1).getValue();
          finalMessage += ":pushpin:" + customerName + " | " + assignmentName + " | " + assignmentDueDate + "\n";
          Logger.log(i + " number");
        }
        
        ss_messenger.getSheetByName('Recurring Messenger').getRange(j, 4).setValue(finalMessage);
      }
    }
  } catch(e) {
    ss_messenger.getSheetByName('Recurring Messenger').getRange(j, 7).setValue("broke...");
  }  
}

function customerDashboard_getLastRow_Upcoming(sheets) {  
  // Returns last row number which contains a value in timestamp column
  var customerDashboard_getLastRow_Upcoming = sheets.getRangeByName("upcoming_duedate").getValues();
  for (i in customerDashboard_getLastRow_Upcoming) {
    if (customerDashboard_getLastRow_Upcoming[i][0] == "") {
      return Number(i);
      break;
    }
  }
}

function testfunction() {
  var date = new Date();
  Logger.log(prettyDate_format(date));

}

function prettyDate_format(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ' ' + ampm;
  return strTime;
}