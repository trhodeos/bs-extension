require.config({
  baseUrl: 'javascript',
  paths: {
    'underscore': '../bower_components/underscore/underscore'
  }
});
var bs = {};
require(['underscore', 'services'], function(_, services) {
  bs.applicableTabs_ = [];
  bs.refreshApplicableTabs = function() {
    chrome.windows.getAll({populate: true}, function(windows) {
      _.each(windows, function(w) {
        var tabs = _.filter(w.tabs, function(tab) {
          return services.handlerRegistry.getFor(tab) != null;  
        });
        bs.applicableTabs_.push.apply(bs.applicableTabs_, tabs);
      });
    });
  };

  var getActiveTab_ = function() {
    if (!bs.activeTab_) {
      var applicableTabs = getApplicableTabs();
      if (applicableTabs.length == 1) {
        bs.activeTab_ = applicableTabs[0];
      }
    }
    return bs.activeTab_;
  };


  chrome.commands.onCommand.addListener(function(command) {
    alert(command);
    bkg.console.log('Command:', command);
  });

})();
