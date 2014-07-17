define(['underscore', 'handler'], function(_, Handler) {
  
  var HandlerRegistry = function(url) {
    _.bindAll(this, 'refresh_', 'add_', 'getFor');
    this.url_ = url;
    this.handlers_ = [];
    this.refresh_();
  };

  HandlerRegistry.prototype.refresh_ = function() {
    var xhr = new XMLHttpRequest();
    var that = this;
    var handleHandlersJson = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        _.each(response, function(handlerJson) {
          that.add_(new Handler(handlerJson));
        });
      }
    };

    xhr.onreadystatechange = handleHandlersJson;
    xhr.open('GET', chrome.extension.getURL(that.url_), true);
    xhr.send();
  };

  HandlerRegistry.prototype.add_ = function(handler) {
    this.handlers_.push(handler);
  };

  HandlerRegistry.prototype.getFor = function(tab) {
    console.log('Getting handler for ' + tab.url);
    var applicableHandlers = _.filter(this.handlers_, function(handler) {
      return tab.url.match(handler.urlRegex());
    });
    if (applicableHandlers.length == 0) {
      return null;
    } else if (applicableHandlers.length > 1) {
      console.log('Found more than one applicable handler for tab ' + tab.url);
      console.log('This shouldn\'t happen! Using ' + applicableHandlers[0].i18nKey);
    }
    return applicableHandlers[0];
  };
    
  return HandlerRegistry;
});
