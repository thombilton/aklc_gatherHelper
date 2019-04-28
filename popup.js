let changeColor = document.getElementById('changeColor');
let goButton = document.getElementById('goButton');
let goButton2 = document.getElementById('goButton2');

// semi redundant function that is replaced by the functions below!
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

//This get called on button click 
goButton2.onclick = function (){

  getCurrentTab(displayTab)
}

//function gets current tab and then calls a callback function to do something with it.
function getCurrentTab(callback){
  var theTab
  chrome.tabs.query({active: true, currentWindow: true}, function(tab){
    callback(tab[0].url)
  });
};

// callback function to do something with the current tab
// currently being used to call the database search
function displayTab(tab){
  consoleLog(tab)
  search(tab);
}

// takes a URL in and searches calls the find by gather ID endpoint
// fetch returns a promise
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

// funcion to deal with the data that fetch byid makes
function dealWithData(promise){
  consoleLog(promise)
}

//generic console.Log() function that outputs to the extensions console.
consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}

function extract(){

}