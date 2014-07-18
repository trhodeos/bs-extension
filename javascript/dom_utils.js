define([], function() {
  return {
    clear: function(el) {
             while (el.firstChild) {
               el.removeChild(el.firstChild);
             }
           }
  };
});
