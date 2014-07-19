require.config({
  baseUrl: chrome.extension.getURL('/javascript'),
  paths: {
    'underscore': '../bower_components/underscore/underscore'
  }
});
var bs = {};
require(['underscore', 'tab_list', 'services'], function(_, TabList, Services) {
  var tabList = new TabList(document.getElementById('tab_list'));
  tabList.render();

  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    console.log(tabList);
    console.log(tabList.getActiveTab());
    
    var activeTab = tabList.getActiveTab();
    if (activeTab) {
    	var activeTabHandler = Services.handlerRegistry.getFor(activeTab);
    	// jf todo: can't we just use the command to pull from the prototype?
    	if (command === "toggle") {
    		activeTabHandler.toggle(activeTab);
    	}
    }
  });
});
