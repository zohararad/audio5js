(function ($) {
  "use strict";

  var Audio5js = require('audio5js');
  $.ender({
    Audio5js: Audio5js
  });
  provide("Audio5js", Audio5js);
}(ender));