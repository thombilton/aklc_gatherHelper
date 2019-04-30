let changeColor = document.getElementById('changeColor');
let goButton2 = document.getElementById('goButton2');

//This get called on button click 
goButton2.onclick = function (){

  //calls function to retrieve the current active tab
  getCurrentTab(displayTab)
}

//function gets current tab and then calls a callback function to do something with it.
function getCurrentTab(callback){
  var theTab
  chrome.tabs.query({active: true, currentWindow: true}, function(tab){
    //calls the function passed into it and send it the current tab info
    callback(tab[0].url)
  });
};

// callback function to do something with the current tab
// currently being used to call the database search
function displayTab(tab){
  consoleLog(tab)
  let extractedString = extract(tab)
  //searchByID(extractedString);
  extractedString.type.localeCompare("ID") ? searchByURL(extractedString.content) : searchByID(extractedString.content)
}

// takes a URL in and searches calls the find by gather ID endpoint
// fetch returns a promise
function searchByID(gatherID){
  
  let fetchString = 'http://aklc-help-server.herokuapp.com/gather/byid/' + encodeURIComponent(gatherID)
  consoleLog(fetchString)
  fetch(fetchString)
  .then(function(data){
    return data.json()
  })
  .then(function(data){
    dealWithData(data, 1)
  })
}

function searchByURL(siteURL){
let fetchString = 'http://aklc-help-server.herokuapp.com/gather/byurl/'

let body = {"URL": siteURL}

let headers = {
  "Content-Type": "application/json",                                                                                                
  "Access-Control-Origin": "*"
}

fetch(fetchString, {
  method: "POST",
  headers: headers,
  body: JSON.stringify(body)
})
.then(function(data){
  return data.json()
})
.then(function(data){
  dealWithData(data, 0)
})

}

// funcion to deal with the data that fetch byid makes
function dealWithData(promise, sourceID){
  let tabToCreate
  

  if(sourceID == 1){
    tabToCreate = "https://cms.aucklandcouncil.govt.nz/"+ promise[0].websiteURL
  }
  if(sourceID == 0){
    tabToCreate ="https://digitalservices.gathercontent.com/item/" + promise[0]._id
  }
  consoleLog(tabToCreate)
  chrome.tabs.create({url:tabToCreate})
}

//generic console.Log() function that outputs to the extensions console.
consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}

function extract(tabURL){
consoleLog(tabURL + " This is the url from the tab inside the extract function")
consoleLog(typeof(tabURL))
let trimmedURL
let type
//Extracts the page required part of the url for submission to the database
if(tabURL.includes("aucklandcouncil.govt.nz")== true){
  trimmedURL = tabURL.substr(35);
  consoleLog(trimmedURL)
  type = "URL"
}
if(tabURL.includes("digitalservices.gathercontent.com") == true){
  trimmedURL = tabURL.substr(47)
  consoleLog(trimmedURL + " digital")
  type = "ID"
}

let toReturn = {
content: trimmedURL,
type: type
}

return toReturn
}