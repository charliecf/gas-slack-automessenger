function postMessage(channel, message) {
  var sheets = SpreadsheetApp.openById('googlesheets_id');  
  var log_nR = log_getLastRow(sheets) + 1;

  var payload = {
    "channel": "#" + channel,
    "icon_url": "http://icons.iconarchive.com/icons/iconsmind/outline/128/Robot-icon.png",
    "link_names": 1,
    "text": message,
    "mrkdwn": true,
    "unfurl_links": true
  };
  
  var info_channel = sheets.getSheetByName('info').getRange(5, 1, info_getLastRow_Webhook(sheets)-4, 2).getValues();
  // Vlookup for webhook URL
  for (i=0; i < info_channel.length; i++) {
    if (channel == info_channel[i][0]) {
      var incoming_webhook = info_channel[i][1]
      Logger.log("match for " + info_channel[i][0] + " is found, webhook is: " + incoming_webhook);
    };  
  }

  var url = incoming_webhook;
  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(url, options);
  
  // Input everything into log
  sheets.getSheetByName('log').appendRow([new Date(), channel, message]); 
}

function log_getLastRow(sheets) {  
  // Returns last row number which contains a value in timestamp column
  var log_timestamp = sheets.getRangeByName("log_timestamp").getValues();
  for (i in log_timestamp) {
    if (log_timestamp[i][0] == "") {
      return Number(i);
      break;
    }
  }
}

function info_getLastRow_Webhook(sheets) {  
  // Returns last row number which contains a value in timestamp column
  var info_getLastRow_Webhook = sheets.getRangeByName("info_incomingWebhooks").getValues();
  for (i in info_getLastRow_Webhook) {
    if (info_getLastRow_Webhook[i][0] == "") {
      return Number(i);
      break;
    }
  }
}