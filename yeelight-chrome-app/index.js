const extensionID = 'kneagfiodgcjdmdgfbpldheamiogbekk'
function sendToExtension(message){
  chrome.runtime.sendMessage(extensionID, message)
}

function rtm(message, callback) {
  if (callback) {
    chrome.runtime.sendMessage(chrome.runtime.id, message, callback);
  } else {
    chrome.runtime.sendMessage(chrome.runtime.id, message);
    
  }
}

function addDevice(did, location, model, name) {
  var devList = document.getElementById('led-list');
  var devItem = document.createElement('li');

  devItem.textContent = did + ' @ ' + location + '@' + model + '@' + name;
  devItem.id = did;
  devList.appendChild(devItem);

}

function sendMessage() {
  var messageInputBox = document.getElementById('input-box');
  var message = messageInputBox.value;
  rtm({
    type: 'request',
    message: message
  });
  messageInputBox.value = '';
}

function sendMessageArgs(message) {  
  rtm({
    type: 'request',
    message: message
  });
}

function init() {
  console.log('init')
  var messageInputBox = document.getElementById('input-box');
  messageInputBox.addEventListener('keydown', function (e) {
      if (e.keyCode == 13) {
          sendMessage();
      }
  });

  let toggleButton = document.getElementById('toggle-lights')
  toggleButton.addEventListener('click', function() {
    sendMessageArgs(JSON.stringify({"id":1,"method":"toggle","params":[]}))
  })

  var closeBox = document.getElementById('close');
  closeBox.onclick = function () {
      chrome.app.window.current().close();
  };

  var splitter = document.getElementById('splitter');
  chrome.storage.local.get('input-panel-size', function (obj) {
    if (obj['input-panel-size']) {
      var inputPanel = document.getElementById('input-panel');
      inputPanel.style.height = obj['input-panel-size'] + 1 + 'px';
    }
  });
  splitter.onmousedown = function (e) {
    if (e.button != 0) {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    var inputPanel = document.getElementById('input-panel');
    var totalHeight = document.body.scrollHeight;
    var panelHeight = inputPanel.scrollHeight;
    var startY = e.pageY;
    var MouseMove;
    document.addEventListener('mousemove', MouseMove = function (e) {
      e.stopPropagation();
      e.preventDefault();
      var dy = e.pageY - startY;
      if (panelHeight - dy < 120) {
        dy = panelHeight - 120;
      }
      if (totalHeight - panelHeight + dy < 120) {
        dy = 120 - totalHeight + panelHeight;
      }
      inputPanel.style.height = panelHeight - dy + 1 + 'px';
      chrome.storage.local.set({'input-panel-size': panelHeight - dy});
    });
      document.addEventListener('mouseup', function MouseUp(e) {
          MouseMove(e);
          document.removeEventListener('mousemove', MouseMove);
          document.removeEventListener('mouseup', MouseUp);
    });
  };

  document.getElementById('led-list').addEventListener(
      "click",function(e) {
          rtm({
              type: 'connect',
              message: 'Contact [' + e.target.textContent  + '] ...' ,
              target: e.target.id
          });
      });
}


chrome.runtime.onMessageExternal.addListener(function (message, sender, sendResponse) {
  switch(message.type){
    case 'ext-request':
      sendMessageArgs(message.message)
      break
    case 'yee-stop':
      chrome.app.window.current().close()
      controlClient.disconnect();
      break
    case 'yee-connect':
      rtm({type: 'connect', message: 'Contacting [' + message.message + '] ...', target: message.message})
    default:
      console.log(message)
  }
})
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  var newMessageLi;
  var messages = document.getElementById('messages');
  if (message) {
    switch (message.type) {
    case 'init':
        init();
        break;
    case 'add-device':
        addDevice(message.did, message.location, message.model, message.name);
        sendToExtension(message)
        break;   
    case 'info':
        //redir to extension
        sendToExtension(message)
        //
        newMessageLi = document.createElement('li');
        newMessageLi.textContent = message.message;
        newMessageLi.setAttribute("class", message.level);
        messages.appendChild(newMessageLi);
        break;
    }
  }
});
