require.config({
  baseUrl: chrome.extension.getURL('/javascript'),
  paths: {
    'underscore': '../bower_components/underscore/underscore'
  }
});
require(['tab_list'], function(TabList) {
  var tabList = new TabList(document.getElementById('tab_list'));
  tabList.render();
});
