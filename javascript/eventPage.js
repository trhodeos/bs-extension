require.config({
  baseUrl: chrome.extension.getURL('/javascript'),
  paths: {
    'underscore': '../bower_components/underscore/underscore'
  }
});
require(['services'], function(Services) {
  chrome.commands.onCommand.addListener(function(command) {
    console.log('Received key command:', command);
    chrome.storage.local.get('activeTab', function(items) {
      if (items.activeTab) {
        chrome.tabs.get(items.activeTab, function(tab) {
          if (tab) {
            var activeTabHandler = Services.handlerRegistry.getFor(tab);
            var fn = activeTabHandler.constructor.prototype[command];
            if (fn) {
              console.log('Invoking tab handler function:', command);
              fn.call(activeTabHandler, tab);
            }
          }  
        });
      }});
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender) {
      console.log('Received active tab from popup');
      if (request.activeTab) {
        chrome.storage.local.set(request, function() {
          console.log('Set active tab to:', request.activeTab);
        });
      }
    });
});