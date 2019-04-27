let changeColor = document.getElementById('changeColor');
let goButton = document.getElementById('goButton');
let goButton2 = document.getElementById('goButton2');

goButton.onclick = function (element) {
  let url = 'http://aklc-help-server.herokuapp.com/gather/byid/2874913'

  chrome.extension.getBackgroundPage().console.log('foo');

  var sending = chrome.runtime.sendMessage({
    contentScriptQuery: 'goButton',
    url: this.url
  }, function (response) {
    consoleLog(response)
    consoleLog(response[0]._id)
    return response
  })
}

goButton2.onclick = function (){

  getCurrentTab(displayTab)
}

function getCurrentTab(callback){
  var theTab
  chrome.tabs.query({active: true, currentWindow: true}, function(tab){
    callback(tab[0].url)
  });
};

function displayTab(tab){
  consoleLog(tab)
  search(tab);
}


function search(currentURL){
  consoleLog(currentURL)
  fetch('http://aklc-help-server.herokuapp.com/gather/byid/2874913')
  .then(function(data){
    return data.json()
  })
  .then(function(data){
    dealWithData(data)
  })
}

function dealWithData(promise){
  consoleLog(promise)
}

consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}

function extract(){
  
}