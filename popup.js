let changeColor = document.getElementById('changeColor');
let goButton2 = document.getElementById('goButton2');
let addNewButton = document.getElementById('createNewButton');

getCurrentTab(extract)
getCurrentTab(displayTab)
let openThisTab

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

  //consoleLog(gatherID)
  //consoleLog(gatherID.includes("digitalservices.gathercontent.com"))
  //consoleLog(websiteURL)
  //consoleLog(websiteURL.includes("aucklandcouncil.govt.nz"))


  if (gatherID.includes("digitalservices.gathercontent.com") == false || websiteURL.includes("aucklandcouncil.govt.nz") == false) {
    document.getElementById("error").innerHTML = "links must be complete and from either gatherContent or the Aklc website"
  } else {

    //consoleLog(websiteURL)

    if (gatherID != "" && websiteURL != "") {
      let trimmedURL = extract(websiteURL)
      let trimmedID = extract(gatherID)
      let fetchString = "http://aklc-help-server.herokuapp.com/gather/new"
      //consoleLog(trimmedID.content)
      //consoleLog(trimmedURL.content)

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

// callback function to do something with the current tab
// currently being used to call the database search
function displayTab(tab) {
  //consoleLog(tab)
  let extractedString = extract(tab)

  // logic for working out what method to search by
  extractedString.type.localeCompare("ID") ? searchByURL(extractedString.content) : searchByID(extractedString.content)
}

// takes a URL in and searches calls the find by gather ID endpoint
// fetch returns a promise
function searchByID(gatherID) {

  let fetchString = 'http://aklc-help-server.herokuapp.com/gather/byid/' + encodeURIComponent(gatherID)
  //consoleLog(fetchString)
  fetch(fetchString)
    .then(function (data) {
      return data.json()
    })
    .then(function (data) {
      dealWithData(data, 1)
    })
}

function searchByURL(siteURL) {
  let fetchString = 'http://aklc-help-server.herokuapp.com/gather/byurl/'

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

  //consoleLog(promise)

  if (promise[0] == undefined) {
    document.getElementById("error").innerHTML = "This link doesnt exist, add it above"
    document.getElementById("info").innerHTML = "Add new link"
    document.getElementById("createNewButton").style.display = "block"
    document.getElementById("goButton2").innerHTML='Go!'
    return
  }

  if (sourceID == 1) {
    tabToCreate = "https://cms.aucklandcouncil.govt.nz" + promise[0].websiteURL
    document.getElementById("websiteURL").value = tabToCreate
    document.getElementById("goButton2").innerHTML='Go!'
    document.getElementById("goButton2").disabled = false

  }
  if (sourceID == 0) {
    tabToCreate = "https://digitalservices.gathercontent.com/item/" + promise[0]._id
    document.getElementById("gatherID").value = tabToCreate
    document.getElementById("goButton2").innerHTML='Go!'
    document.getElementById("goButton2").disabled = false
    
  }
  //consoleLog(tabToCreate)

  openThisTab = tabToCreate
/*   chrome.tabs.create({
    url: tabToCreate
  }) */
}

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

  return toReturn
}

//generic console.Log() function that outputs to the extensions console.
consoleLog = function (input) {
  chrome.extension.getBackgroundPage().console.log(input);
}