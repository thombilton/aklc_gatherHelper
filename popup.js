let changeColor = document.getElementById('changeColor');
let goButton2 = document.getElementById('goButton2');
let addNewButton = document.getElementById('createNewButton');
let feedbackButton = document.getElementById('feedbackButton');

let currentTabUrl;
let openThisTab;

getCurrentTab(extract)

//This get called on button click 
goButton2.onclick = function () {
  //calls function to retrieve the current active tab
  //getCurrentTab(displayTab)

  chrome.tabs.create({
    url: openThisTab
  })
}

addNewButton.onclick = function () {

  let websiteURL = document.getElementById("websiteURL").value
  let gatherID = document.getElementById("gatherID").value

  if (gatherID.includes("digitalservices.gathercontent.com") == false || websiteURL.includes("aucklandcouncil.govt.nz") == false) {
    document.getElementById("error").innerHTML = "links must be complete and from either gatherContent or the Aklc website"
  } else {

    if (gatherID != "" && websiteURL != "") {
      let trimmedURL = extract(websiteURL)
      let trimmedID = extract(gatherID)
      let fetchString = "https://az4qfijgi8.execute-api.us-east-1.amazonaws.com/dev/gather/new"

      let body = {
        _id: trimmedID.content,
        websiteURL: trimmedURL.content
      }

      let headers = {
        "Content-Type": "application/json",
        "Access-Control-Origin": "*"
      }

      fetch(fetchString, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
        })
        .then(function (data) {
          return data.json()
        })
        .then(function (data) {
          document.getElementById("error").innerHTML = data.content

          if(data!= undefined){
            document.getElementById("error").innerHTML = "Link created successfully"
            document.getElementById("createNewButton").disabled = true
          }
        })
        .then(function (data){
          getCurrentTab(displayTab);
        })

    } else {
      document.getElementById("error").innerHTML = "please put full urls in both feilds"
      return
    }
  }
}

//function gets current tab and then calls a callback function to do something with it.
function getCurrentTab(callback) {
  var theTab
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tab) {
    //calls the function passed into it and send it the current tab info
    callback(tab[0].url)
  });
};

function extract(tabURL) {
  let trimmedURL
  let type
  //Extracts the page required part of the url for submission to the database
  if (tabURL.includes("aucklandcouncil.govt.nz") == true) {
    trimmedURL = tabURL.substr(35);
    type = "URL"
    document.getElementById("websiteURL").value = tabURL
  }
  if (tabURL.includes("digitalservices.gathercontent.com") == true) {
    trimmedURL = tabURL.substr(47)
    type = "ID"
    document.getElementById("gatherID").value = tabURL
  }

  let toReturn = {
    content: trimmedURL,
    type: type
  }
  //currentTabUrl = toReturn;

  toReturn.type.localeCompare("ID") ? searchByURL(toReturn.content) : searchByID(toReturn.content)

  return toReturn
}

// takes a URL in and searches calls the find by gather ID endpoint
// fetch returns a promise
function searchByID(gatherID) {

  //let fetchString = 'http://localhost:3000/gather/byid/' + encodeURIComponent(gatherID)
  let fetchString = 'https://az4qfijgi8.execute-api.us-east-1.amazonaws.com/dev/gather/byid/' + encodeURIComponent(gatherID)
  fetch(fetchString)
    .then(function (data) {
      return data.json()
    })
    .then(function (data) {
      console.log('made it to output')
      dealWithData(data, 1)
    })
}

function searchByURL(siteURL) {
  let fetchString = 'https://az4qfijgi8.execute-api.us-east-1.amazonaws.com/dev/gather/byurl/'
  //let fetchString = 'http://localhost:3000/gather/byurl/'

  let body = {
    "URL": siteURL
  }

  let headers = {
    "Content-Type": "application/json",
    "Access-Control-Origin": "*"
  }

  fetch(fetchString, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })
    .then(function (data) {
      return data.json()
    })
    .then(function (data) {
      dealWithData(data, 0)
    })

}

// funcion to deal with the data that fetch byid makes
function dealWithData(promise, sourceID) {
  let tabToCreate

  console.log(promise.db);

  if(promise.api != null){
    if(promise.api.modifiedAt != null){
      document.getElementById("modifiedDate").innerHTML = promise.api.modifiedAt
    }
    if(promise.api.assigned != null){
      showAssigned(promise.api.assigned)
    }
  }

  if (promise.db[0] == undefined) {
    document.getElementById("error").innerHTML = "This link doesnt exist, add it above"
    document.getElementById("info").innerHTML = "Add new link"
    document.getElementById("createNewButton").style.display = "block"
    document.getElementById("goButton2").innerHTML='Go!'
    return
  }  
  
  if (sourceID == 1) {
    console.log('made it to 1')
    tabToCreate = "https://cms.aucklandcouncil.govt.nz" + promise.db[0].websiteURL
    feedbackURL = "https://www.aucklandcouncil.govt.nz" + promise.db[0].websiteURL
    //calls method for generating the feedback url.
    document.getElementById("websiteURL").value = tabToCreate
    document.getElementById("goButton2").innerHTML='Go!'
    document.getElementById("goButton2").disabled = false

  }
  if (sourceID == 0) {
    console.log(promise)
    tabToCreate = "https://digitalservices.gathercontent.com/item/" + promise.db[0]._id
    document.getElementById("gatherID").value = tabToCreate
    document.getElementById("goButton2").innerHTML='Go!'
    document.getElementById("goButton2").disabled = false
    
  }

  openThisTab = tabToCreate
}

function findFeedback(url){
  consoleLog(url);
}

function showAssigned(assigned){

  for (let index = 0; index < assigned.length; index++) {
    document.getElementById("gatherAssigned").innerHTML += (index+1) + ": " + '<a href = "https://teams.microsoft.com/l/chat/0/0?users=' + assigned[index].first_name + '.' + assigned[index].last_name + '@aucklandcouncil.govt.nz" target="_blank">' + assigned[index].first_name + ' ' + assigned[index].last_name +'</a> <br/>';
  }
  
}

//generic console.Log() function that outputs to the extensions console.
consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}