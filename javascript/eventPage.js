require.config({
  baseUrl: chrome.extension.getURL('/javascript'),
  paths: {
    'underscore': '../bower_components/underscore/underscore'
  }
});
require(['services'], function(Services) {
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Received key command:', command);
    chrome.storage.local.get('activeTabId', function(items) {
      if (items.activeTabId) {
        chrome.tabs.get(items.activeTabId, function(tab) {
          if (tab) {
            var activeTabHandler = Services.handlerRegistry.getFor(tab);
            var fn = activeTabHandler.constructor.prototype[command];
            if (fn) {
              console.log('Invoking tab handler function:', command);
              fn.call(activeTabHandler, tab);
            }
          }
        });
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
    chrome.storage.local.get('activeTabId', function(items) {
      if (items.activeTabId === tabId) {
        chrome.storage.local.set({activeTabId: null}, function() {
          console.log('Active tab removed.');
        });
      }
    });
  });
});
