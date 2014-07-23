chrome.commands.onCommand.addListener(function(command) {
  console.log('Received key command:', command);
  chrome.storage.local.get(['activeTabId', 'handler'], function(items) {
    if (items.activeTabId && items.handler) {
      var handler = JSON.parse(items.handler);
      var fn = handler[command];
      if (fn) {
        chrome.tabs.get(items.activeTabId, function(tab) {
          if (tab) {
            console.log('Invoking tab handler function:', fn);
            chrome.tabs.executeScript(tab.id, {code: fn});
          }
        });
      }
    }
  });
});

// listen for tab removals. if the removed tab is our active tab,
// then deactivate it.
// JF TODO: we should do something if the URL changes, too.
// JF TODO: this might be overkill. we could just let it error out
// above. this has the extra cost of waking up the event page on every
// tab close...
chrome.tabs.onRemoved.addListener(function(tabId) {
  chrome.storage.local.get(['activeTabId', 'handler'], function(items) {
    if (items.activeTabId === tabId) {
      chrome.storage.local.set({activeTabId: null, handler: null}, function() {
        console.log('Active tab removed.');
      });
    }
  });
});
