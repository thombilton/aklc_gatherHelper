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
        hostContains: '.aucklandcouncil.govt.nz',
      },
    }),
    new chrome.declarativeContent.PageStateMatcher({
      pageUrl: {
        hostContains: 'digitalservices.gathercontent.com',
      },
    })],
    actions: [new chrome.declarativeContent.ShowPageAction()]
  },]);
});

consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}