chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({
    color: '#3aa757'
  }, function () {
    console.log("The color is green.");
  });
});

chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {
        hostContains: '.aucklandcouncil.govt.nz'
      },
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  }]);
});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {

    let responseJson

    if (request.contentScriptQuery == 'goButton') {
      fetch('http://aklc-help-server.herokuapp.com/gather/byid/2874913')
      .then(function(data){
        return data.json()
      })
      .then(function(myJson){
        consoleLog(JSON.stringify(myJson))
        sendResponse(myJson)
      })
      return true
    }
  }
)

/* getCurrentURL = function () {
  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function (tabs) {
    consoleLog(tabs[0].url);
  });
} */

consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}