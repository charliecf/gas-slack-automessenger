function dt_autoSender() {
  var sheets = SpreadsheetApp.openById('googlesheets_id');  
  
  // Loop through all the Send Messages
  for (var i=2; i < dt_getLastRow(sheets)+1; i++) {
    var nR = i
    var dt_trigger_datetime = sheets.getRangeByName('dt_trigger_datetime').getCell(nR, 1).getValue();
    var now = new Date();
    var timeDiff = dt_trigger_datetime - now // after in miliseconds

    // Get the status of the message, do not send if it's already been marked sent
    var dt_status = sheets.getRangeByName('dt_status').getCell(nR, 1).getValue();
    
    if ((Math.abs(timeDiff) < 120000) && (dt_status !== "sent")) {
      // Sends slack message of row n
      dt_sendSlackMsg(nR);
    } else {
      Logger.log("not sending message on row: " + nR + ", it is suppose to be sent on " + dt_trigger_datetime);
    }
  }
}

function dt_sendSlackMsg(nR) {
  var sheets = SpreadsheetApp.openById('googlesheets_id');  

  var dt_channel = sheets.getRangeByName('dt_channel').getCell(nR, 1).getValue();
  var dt_message = sheets.getRangeByName('dt_message').getCell(nR, 1).getValue();
  //Logger.log(dt_channel);
  //Logger.log(dt_message);
  
  try {
    postMessage(dt_channel, dt_message);
    // Log down that the message has been sent
    Logger.log("Message Sent");
    sheets.getRangeByName('dt_status').getCell(nR, 1).setValue("sent");
  } catch(e) { // catch errors
    if (dt_channel == "") {
      var error_channel = " channel is blank."
    }
    if (dt_message == "") {
      var error_message = " messages is blank."
    }
    sheets.getRangeByName('dt_status').getCell(nR, 1).setValue("Failed on " + new Date() + error_channel + error_message);
  }
}

function dt_getLastRow(sheets) {  
  // Returns last row number which contains a value in timestamp column
  var dt_trigger_datetime = sheets.getRangeByName("dt_trigger_datetime").getValues();
  for (i in dt_trigger_datetime) {
    if (dt_trigger_datetime[i][0] == "") {
      return Number(i);
      break;
    }
  }
}