// background.js

// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//   // Send a message to the active tab
//   chrome.tabs.query({currentWindow: true}, function(tabs) {
//     tabs.forEach(tab => {
//       console.log(tab)
//       // chrome.tabs.sendMessage(tab.id, {"message": "clicked_browser_action", "tab": tab});
//     })
//   });
// });

// This block is new!
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "settings saved" ) {
      chrome.storage.sync.get("testWindow", function(data){
        console.log(data);
      })
    }
  }
);

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log('Storage key "%s" in namespace "%s" changed. ' +
                'Old value was "%s", new value is "%s".',
                key,
                namespace,
                storageChange.oldValue,
                storageChange.newValue);
  }
  console.log(changes);
});


// document.addEventListener('click', function(event){
//   let tar = event.target.innerHTML;
//   chrome.storage.sync.get([tar], function(data){
//     console.log(data);
//   })
// })

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

