let changeColor = document.getElementById('changeColor');
let goButton = document.getElementById('goButton');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.executeScript(
          tabs[0].id,
          {code: 'document.body.style.backgroundColor = "' + color + '";'});
    });
  };

goButton.onclick = function(element) {
  let url = 'http://aklc-help-server.herokuapp.com/gather/byid/2874913'

  chrome.extension.getBackgroundPage().console.log('foo');
  chrome.runtime.sendMessage({ contentScriptQuery : 'goButton', url: this.url}, function(response){
    consoleLog(response);
  })
/*   fetch('http://aklc-help-server.herokuapp.com/gather/byid/2874913')
  .then(function(response){
      consoleLog(response.json());
  }) */
}


consoleLog = function(input){
  chrome.extension.getBackgroundPage().console.log(input);
}