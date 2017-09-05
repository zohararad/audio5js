/*!
 * Audio5js: HTML5 Audio Compatibility Layer
 * https://github.com/zohararad/audio5js
 * License MIT (c) Zohar Arad 2013
 */
(function ($win, ns, factory) {
  "use strict";
  /*global define */

  if (typeof (module) !== 'undefined' && module.exports) { // CommonJS
    module.exports = factory();
  } else if (typeof (define) === 'function' && define.amd) { // AMD
    define(function () {
      return factory();
    });
  } else { // <script>
    $win[ns] = factory();
  }

}(window, 'Playlist5js', function () {

  "use strict";

  /*global Audio5js*/

  if (!Audio5js) {
    throw new Error('Audio5js class not defined. Did you load the audio5.js javascript?');
  }

  var playlistSettings = {
    autonext: false,
    urls: [],
    options: {},
    events: {}
  };

  function _createAudio5js(playlist) {
    var file = playlist.settings.urls[playlist.current];
    var settings = playlist.settings;

    // Setting the Ready to Load the file
    var curReady = settings.options.ready || function() {};
    settings.options.ready = function () {
      if (this) {
        this.load(file);
        curReady();
      }
    };

    // Setting Audio events based on Default Playlist events
    var audioObj = new Audio5js(settings.options);
    for (var k in settings.events) {
      if (settings.events.hasOwnProperty(k)) {
        audioObj.on(k, settings.events[k]);
      }
    }

    // Setting Autoplay
    if (settings.autoplay === true) {
      audioObj.on('ended', function() {
        var audio = playlist.next();
        if (audio) {
          playlist.next();
        }
      });
    }

    return audioObj;
  }

  /**
   * Audio5js Playlist
   * @param {Object} s player settings object
   * @constructor
   */
  var Playlist5js = function (s) {
    s = s || {};
    var k;
    for (k in playlistSettings) {
      if (playlistSettings.hasOwnProperty(k) && !s.hasOwnProperty(k)) {
        s[k] = playlistSettings[k];
      }
    }
    this.init(s);
  };

  Playlist5js.prototype = {
    /**
     * Initialize the playlist
     * @param {Object} s options
     */
    init: function (s) {
      this.settings = s;
      this.current = -1;
      this.currentAudio = null;
    },

    /**
     * Get the next track of the playlist
     * @return {Audio5js} The Audio5js instance
     */
    next: function () {
      return this.goTo(this.current+1);
    },

    /**
     * Get the previous track of the playlist
     * @return {Audio5js} The Audio5js instance
     */
    previous: function () {
      return this.goTo(this.current-1);
    },

    /**
     * Go to a specific index of the playlist
     * @return {Audio5js} The Audio5js instance
     */
    goTo: function (n) {
      if (n >= 0 && n < this.settings.urls.length) {
        if (this.current !== n && this.currentAudio) {
          this.currentAudio.destroy();
        }
        this.current = n;
        this.currentAudio = _createAudio5js(this);
        return this.currentAudio;
      }
    },

    /**
     * Goto to the first file in playlist and start playing
     */
    play: function() {
      if (!this.currentAudio) {
        this.goTo(0);
      }
      this.currentAudio.play();
    },

    toggle: function() {
      if (!this.currentAudio) {
        this.goTo(0);
      }

      if (this.currentAudio.playing) {
        this.pause();
      } else {
        this.play();
      }
    },

    /**
     * Pause the current audio.
     */
    pause: function() {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
    }
  };

  return Playlist5js;

}));
