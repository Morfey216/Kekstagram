'use strict';

(function () {
  var Keycode = {
    ESC: 27,
    ENTER: 13
  };

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ESC) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === Keycode.ENTER) {
        action();
      }
    },
    getIndexFromRange: function (minIndex, maxIndex) {
      return Math.floor(Math.random() * (maxIndex - minIndex)) + minIndex;
    }
  };
})();
