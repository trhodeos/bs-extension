define([], function() {
  var Handler = function(json) {
    this.json_ = json;
    this.urlRegex_ = new RegExp(json.urlToMatch);
  };

  var executeInTab = function(tab, code) {
    chrome.tabs.executeScript(tab.id, {code: code});
  };

  Handler.prototype.urlRegex = function() {
    return this.urlRegex_;
  };

  Handler.prototype.matches = function(tab) {
    return tab.url.match(this.urlRegex_);
  };

  Handler.prototype.toggle = function(tab) {
    executeInTab(tab, this.json_.toggle);
  };

  Handler.prototype.pause = function(tab) {
    executeInTab(tab, this.json_.pause);
  };

  Handler.prototype.previous = function(tab) {
    executeInTab(tab, this.json_.previous);
  };

  Handler.prototype.next = function(tab) {
    executeInTab(tab, this.json_.next);
  };

  return Handler;
});
