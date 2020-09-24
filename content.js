// content.js
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      console.log(request.tab);

      // This line is new!
      chrome.runtime.sendMessage({"message": "log_all_tabs", "tab": request.tab});
    }
  }
);

let button = document.createElement("button");

