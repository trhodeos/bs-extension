define(['underscore', 'services', 'dom_utils'],
    function(_, Services, DomUtils) {
  var TabList = function(el, opt_template_id) {
    this.el_ = el;
    var tmplId = opt_template_id || 'tab_list_element_template';
    var templateEl_ = document.getElementById(tmplId);
    this.template_ = _.template(templateEl_.innerHTML);
    _.bindAll(this, 'refresh_', 'render');
  };

  TabList.prototype.refresh_ = function(cb) {
    var that = this;
    that.applicableTabs_ = [];
    chrome.windows.getAll({populate: true}, function(windows) {
      _.each(windows, function(w) {
        var tabs = _.filter(w.tabs, function(tab) {
          return Services.handlerRegistry.getFor(tab) != null;
        });
        that.applicableTabs_.push.apply(that.applicableTabs_, tabs);
      });
      if (that.applicableTabs_.length > 0) {
        console.log('calling cb with ');
        console.log(that.applicableTabs_);
        cb(that.applicableTabs_);
      }
    });
  };

  TabList.prototype.render = function() {
    var that = this;
    that.refresh_(function(tabs) {
      DomUtils.clear(that.el_);
      _.each(tabs, function(tab, index) {
        var item = DomUtils.listItem(tab.title);
        item.addEventListener('click', function() {
          that.activateTab(index);
        }, false);
        that.el_.appendChild(item);
      });
    });
  };

  TabList.prototype.activateTab = function(index) {
    var activeTab = this.applicableTabs_[index];
    var activeTabId = activeTab.id;
    if (activeTabId) {
      chrome.storage.local.get('activeTabId', function(items) {
        if (items.activeTabId && items.activeTabId !== activeTabId) {
          // an active tab already exists. so pause it.
          chrome.tabs.get(items.activeTabId, function(tab) {
            if (tab) {
              console.log('Pausing old tab.');
              var activeTabHandler = Services.handlerRegistry.getFor(tab);
              activeTabHandler.pause(tab);
            }
          });
        }

        var json = Services.handlerRegistry.getFor(activeTab).json_;
        chrome.storage.local.set({activeTabId: activeTabId, handler: JSON.stringify(json)}, function() {
          console.log('Set active tab to:', activeTabId);
          console.log('Set handler to:', json);
        });
      });
    }
  };

  return TabList;
});
