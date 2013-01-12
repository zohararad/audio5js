(function ($) {
  "use strict";

  var Audio5 = require('audio5');
  $.ender({
    Audio5: Audio5
  });
  provide("Audio5", Audio5);
}(ender));