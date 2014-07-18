require.config({
  baseUrl: chrome.extension.getURL('/javascript'),
  paths: {
    'underscore': '../bower_components/underscore/underscore'
  }
});
var bs = {};
require(['underscore', 'tab_list'], function(_, TabList) {
  var tabList = new TabList(document.getElementById('main'));
  tabList.render();

  chrome.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
  });
});
