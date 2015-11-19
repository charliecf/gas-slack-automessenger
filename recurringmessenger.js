// getDay gives you:
// 0 - Sunday
// 1 - Monday
// 2 - Tuesday
// 3 - Wednesday
// 4 - Thursday
// 5 - Friday
// 6 - Saturday

function re_autoSender() {
  var sheets = SpreadsheetApp.openById('googlesheets_id');
  var date_now = new Date();
  Logger.log(date_now);
  Logger.log(date_now.toTimeString());  
  
  try {
  for (var i=2; i < re_getLastRow(sheets)+1; i++) {
    var re_trigger_time = sheets.getRangeByName("re_trigger_time").getCell(i, 1).getValue();
    Logger.log(re_trigger_time.toTimeString());
  
    // Convert date_now into seconds
    var h_now = date_now.getHours();
    var m_now = date_now.getMinutes();
    var s_now = date_now.getSeconds();
    var seconds_from0 = (h_now) * 60 * 60 + (m_now) * 60 + (s_now); // minutes are worth 60 seconds. Hours are worth 60 minutes.
    Logger.log(seconds_from0);
  
    // Convert re_trigger_time into seconds
    var h_set = re_trigger_time.getHours();
    var m_set = re_trigger_time.getMinutes();
    var s_set = re_trigger_time.getSeconds();
    var trigger_seconds_from0 = (h_set) * 60 * 60 + (m_set) * 60 + (s_set);
    Logger.log(trigger_seconds_from0);
  
    // Calculates time difference between date_now and re_trigger_time
    var re_timeDiff = seconds_from0 - trigger_seconds_from0; // result in seconds
    Logger.log(re_timeDiff);
  
    // To prevent double sending
    var re_lastsent = checkDateValid(sheets.getRangeByName('re_lastsent').getCell(i, 1).getValue());
    var lastsent_timeDiff = re_lastsent - date_now // result in miliseconds
    Logger.log(lastsent_timeDiff);
  
    // Check if trigger_days match
    var re_trigger_days = sheets.getRangeByName('re_trigger_days').getCell(i, 1).getValue();
    var date_now_day = date_now.getDay(); // getDay of today's weekdate
    Logger.log(re_trigger_days);
    Logger.log(date_now_day);
    var re_trigger_days_true = false; // Set default to false
    
    switch(date_now_day) {
      case 0:  // Sunday
        Logger.log("date_now_day is Sunday");
        var match = /(\bsunday\b)/i; // Matches for sunday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }        
        break;
      case 1:  // Monday
        Logger.log("date_now_day is Monday");
        var match = /(\bmonday\b)/i; // Matches for monday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }
        break;
      case 2:  // Tuesday
        Logger.log("date_now_day is Tuesday");
        var match = /(\btuesday\b)/i; // Matches for tuesday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }      
        break;
      case 3:  // Wednesday
        Logger.log("date_now_day is Wednesday");
        var match = /(\bwednesday\b)/i; // Matches for monday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }
        break;      
      case 4:  // Thursday
        Logger.log("date_now_day is Thursday");
        var match = /(\bthursday\b)/i; // Matches for monday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }      
        break;
      case 5:  // Friday
        Logger.log("date_now_day is Friday");
        var match = /(\bfriday\b)/i; // Matches for monday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }      
        break;
      case 6:  // Saturday
        Logger.log("date_now_day is Saturday");
        var match = /(\bsaturday\b)/i; // Matches for monday, need boundary, case insensitive
        if (match.test(re_trigger_days)) {
          re_trigger_days_true = true;
        }      
        break;
      default:  // Error case with no matches
        Logger.log("Error, no match found for re_trigger_days");
    }
  
    // See if the timeDiff is within 2 minutes.
    if ((Math.abs(re_timeDiff) < 120) && (Math.abs(lastsent_timeDiff) > 900000) && (re_trigger_days_true == true)) {
      Logger.log("Match! Should sent message");
      re_sendSlackMsg(i);
    } else {
      Logger.log("No match found. Do not send message.")
    }
  }
  } catch(e) {
    Logger.log("Error on row: " + i);
  }
}

function re_sendSlackMsg(nR) {
  var sheets = SpreadsheetApp.openById('googlesheets_id');  
    
  var re_channel = sheets.getRangeByName('re_channel').getCell(nR, 1).getValue();
  var re_message = sheets.getRangeByName('re_message').getCell(nR, 1).getValue();

  try {
    postMessage(re_channel, re_message);
    // Log down that the message has been sent
    Logger.log("Message Sent");
    sheets.getRangeByName('re_lastsent').getCell(nR, 1).setValue(new Date());    
  } catch(e) { // catch errors
    if (re_channel == "") {
      var error_channel = " channel is blank."
    }
    if (re_message == "") {
      var error_message = " messages is blank."
    }
    sheets.getRangeByName('re_lastsent').getCell(nR, 1).setValue("Failed on " + new Date() + error_channel + error_message);
  }

}

function re_getLastRow(sheets) {  
  // Returns last row number which contains a value in timestamp column
  var re_trigger_days = sheets.getRangeByName("re_trigger_days").getValues();
  for (i in re_trigger_days) {
    if (re_trigger_days[i][0] == "") {
      return Number(i);
      break;
    }
  }
}

function checkDateValid(d) {
  if ( Object.prototype.toString.call(d) === "[object Date]" ) {
    // it is a date
    if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
      return 0;
    }
    else {
      return d;
    }
  }
  else {
    return 0;
  }
}