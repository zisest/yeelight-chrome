var kIP = "239.255.255.250";
var kPort = 1982;
var controlClient;

function rtm(message, callback) {
  if (callback) {
    chrome.runtime.sendMessage(chrome.runtime.id, message, callback);
  } else {
    chrome.runtime.sendMessage(chrome.runtime.id, message);
  }
}

function onInitWindow(appWindow) {
    appWindow.show();
    var document = appWindow.contentWindow.document;
    document.addEventListener('DOMContentLoaded', function () {
        controlClient.scan();
        rtm({
                type: 'init'
            });
    });

    appWindow.onClosed.addListener(function(){
        controlClient.disconnect();
    });

}

function createMainWindow() {
  chrome.app.window.create('index.html', {
    singleton: true,
    id: 'main-window',
    minWidth: 400,
    minHeight: 275,
    frame: 'none',
    bounds: {
      left: 100,
      top: 100,
      width: 650,
      height: 520
    },
    hidden: true
  }, onInitWindow);
}

function initClient() {
  var cc = new ControlClient({
    address: kIP,
    port: kPort
  });

  cc.onAddDevice = function (did, location) {
    rtm({
      type: 'add-device',
      did: did,
      location: location
    });
  };
  cc.onResult = function (result) {
    rtm({
      type: 'result',
      result: result
    });
  };
  cc.onInfo = function (message) {
    rtm({
      type: 'info',
      message: message
    });
  };    
  cc.onDevResponse = function (data) {
    rtm({
      type: 'info',
      message: "RSP: " + data
    });
  };        
  controlClient = cc;
}
/*
chrome.app.runtime.onLaunched.addListener(function () {
    initClient();
    createMainWindow();
});
*/
chrome.runtime.onStartup.addListener(function() {
  initClient();
  createMainWindow();
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message) {
    switch (message.type) {
      case 'connect':
          controlClient.connectDev(message.message, message.target);
        return true;
        break;
      case 'request':
          controlClient.sendRequest(message.message);
        return true;
        break;
    }
  }
  return false;
});
