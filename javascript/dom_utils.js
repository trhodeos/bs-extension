define([], function() {
  return {
    clear: function(el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild);
      }
    },
    append: function(el, html) {
      // DANGER DANGER... oh well
      el.innerHTML += html;
    },
    listItem: function(id, value) {
      var el = document.createElement('li');
      el.id = id;
      el.innerText = value;
      return el;
    }
  };
});
