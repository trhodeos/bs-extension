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
});
