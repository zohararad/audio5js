# Audio5js - The HTML5 Audio Compatibility Layer

Audio5js a library-agnostic, cross-browser Javascript API for HTML5 Audio, with
a Flash fallback for either older browsers or modern browsers without MP3 playback support.

There are many great audio playback libraries out there, each trying to solve a different problem.
Audio5js tries to address or avoid the following:

* **Library-agnostic** - Audio5js doesn't rely on any external library like jQuery or Dojo, leaving the DOM manipulation part to you.
* **Multi-codec** - Audio5js assumes you'll want to support any commonly available audio codec, not just MP3.
* **Lightweight** - Audio5js doesn't try and implement anything beyond the bare-bones HTML5 Audio playback API, keeping it light and nimble.
* **Javascript-only** - Audio5js doesn't depend on existing `<audio>` tags in your DOM, but instead lets you programmatically control every aspect of the audio playback cycle from Javascript.
* **No UI** - Each player is different, and therefore the visual and functional implementation is left to you. Audio5js aims to facilitate the authoring of your audio player UI by exposing a unified API, and nothing more.
* **No fluffy penguin abuse** - Audio5js will never abuse or hurt fluffy penguins wherever they might be.

## Getting Started

Audio5js requires two components to work - the Javascript library `audio5.js` (or the minified version `audio5.min.js`) and the SWF fallback, found in `swf/audio5js.swf`.

Simply download the source code, extract, and place both files somewhere in your project. For the purpose of demonstration,
let's assume your project directory structure looks like this:

```
/
-/public
--/js
--- audio5.js
--/swf
--- audio5js.swf
```

Now, you can include the Javascript in your HTML, and instantiate the Audio player:

```html
<script src="/js/audio5.js"></script>
<script>
  function initAudio () {
    var audio5js = new Audio5js({
      ready: function () {
        this.load('/someaudio.mp3');
        this.play();
      }
    });
  }
  initAudio();
</script>
```

## Configuration

The Audio5js object accepts a configuration object with the following settings:

* **swf_path** - The relative path to the MP3 Flash fallback SWF. Defaults to `/swf/audio5js.swf`.
* **codecs** - Array of audio codecs to the player should try and play. Used to initialize the internal audio player based on codec support. Defaults to `['mp3']`.
* **throw_errors** - A boolean flag indicating whether the player throws errors, or triggers an error event. Defaults to `true`.
* **format_time** - A boolean flag indicating whether playback position and duration should be formatted to a time-string (hh:mm:ss), or remain as unformatted numbers (measured in seconds). Defaults to `true`.
* **ready** - An optional callback that will be called when the player is ready to load and play audio. Called with an object containing player engine (html/flash) and supported codec as argument.

Here's an example configuration using all the settings options above:

```html
<script>

  var initAudio = function () {
    var audio5js = new Audio5js({
      swf_path: '/statics/swf/audio5js.swf',
      throw_errors: true,
      format_time: true,
      ready: function (player) {
        //this points to the audio5js instance
        this.load('/audio/song.mp3');
        this.play();
        //will output {engine:'html', codec: 'mp3'} in browsers that support MP3 playback.
        // will output {engine:'flash', codec: 'mp3'} otherwise
        console.log(player);
      }
    });

  }

  initAudio();
</script>
```

## API

Audio5js exposes the following API:

### Instance Methods

* **load** - load an audio file from URL
* **play** - play loaded audio
* **pause** - pause loaded audio
* **playPause** - toggle play/pause playback state
* **volume** - get / set volume (volume range is 0-1)
* **seek** - move playhead position to a given time in seconds

### Instance Attributes

* **playing** - boolean flag indicating whether audio is playing (true) or paused (false).
* **duration** - audio duration in seconds.
* **position** - audio playhead position in seconds.
* **load_percent** - audio file download percentage (ranges 0 - 100).
* **seekable** - audio is seekable (download) or not (streaming).

### Class Methods

* **can_play** - Utility method to check whether the browser supports a certain audio mime-types.

`Audio5js.can_play` class method supports the following mime-type queries:

* **mp3** - check for `audio/mpeg; codecs="mp3"`. Example - `Audio5js.can_play('mp3')`
* **vorbis** - check for `audio/ogg; codecs="vorbis"`. Example - `Audio5js.can_play('vorbis')`
* **opus** - check for `audio/ogg; codecs="opus"`. Example - `Audio5js.can_play('opus')`
* **webm** - check for `audio/webm; codecs="vorbis"`. Example - `Audio5js.can_play('webm')`
* **mp4** - check for `audio/mp4; codecs="mp4a.40.5"`. Example - `Audio5js.can_play('mp4')`
* **wav** - check for `audio/wav; codecs="1"`. Example - `Audio5js.can_play('wav')`

### API Example

```html
<button id="play-pause" type="button">Play / Pause</button>
<button id="move-to-start" type="button">Move to Start</button>
<script>

  var audioReady = function () {
    this.load('/audio/song.mp3');
    var play_pause = document.getElementById('play-pause');
    play_pause.addEventListener('click', playPause.bind(this));
    var move_to_start = document.getElementById('move-to-start');
    move_to_start.addEventListener('click', moveToStart.bind(this));
  }

  var playPause = function () {
    if (this.playing) {
      this.pause();
      this.volume(0);
      console.log(this.position, this.duration, this.load_percent, this.volume());
    } else {
      this.play();
      this.volume(1);
    }
    // or simply call this.playPause();
  }

  var moveToStart = function () {
    this.seek(0);
  }

  var initAudio = function () {
    var audio5js = new Audio5js({
      swf_path: '/statics/swf/audio5js.swf',
      throw_errors: true,
      format_time: true,
      ready: audioReady
    });

  }

  initAudio();
</script>
```

## Events

Like HTML5's Audio, Audio5js exposes events that can be used to capture the state and properties of the audio playback cycle:

* **play** - triggered when the audio begins playing. Analogue to HTML5 Audio `play` event.
* **pause** - triggered when the audio is paused. Analogue to HTML5 Audio `pause` event.
* **ended** - triggered when the audio playback has ended. Analogue to HTML5 Audio `ended` event.
* **error** - triggered when the audio load error occurred. Analogue to HTML5 Audio `error` event.
* **timeupdate** - triggered when the audio playhead position changes (during playback). Analogue to HTML5 Audio `timeupdate` event.
* **progress** - triggered while audio file is being downloaded by the browser. Analogue to HTML5 Audio `progress` event.

### Using Events

To subscribe to an event triggered by Audio5js, you can use the `on` method. Similarly, to unsubscribe from an event, you can use the `off` method.

The `on` method accepts the following arguments:

* **event** - name of event to subscribe to
* **callback** - callback function to execute when the event is triggered
* **context** - execution context of callback function (reference to `this` inside the callback)

The `off` method accepts the following arguments:

* **event** - name of event to unsubscribe from
* **callback** - the callback function passed during the event subscription

```javascript

var audio5js = new Audio5js({
  ready: audioReady
});

var audioReady = function () {
  //this points to the Audio5js instance
  this.on('play', function () { console.log('play'); }, this);
  this.on('pause', function () { console.log('pause'); }, this);
  this.on('ended', function () { console.log('ended'); }, this);

  // timeupdate event passes audio duration and position to callback
  this.on('timeupdate', function (position, duration) {
    console.log(position, duration);
  }, this);

  // progress event passes load_percent to callback
  this.on('progress', function (load_percent) {
    console.log(load_percent);
  }, this);

  //error event passes error object to callback
  this.on('error', function (error) {
    console.log(error.message);
  }, this);
}
```

## Fallbacks and multiple audio sources

Browser-based audio isn't perfect, and it's more than likely that you'll need to serve the same audio in two formats, to support
a wider crowd. If you intend to play different audio sources, based on browser codec support, pass a list of desired codecs to the
`codecs` array of the settings object. Note that passed codecs should be listed in order or precedence and
that 'mp3' is always the fallback codec in case no other codec is supported by the browser.

Here's an example of initializing Audio5js with multiple audio sources, based on browser support:

```javascript

  var audio5js = new Audio5js({
    swf_path: '/swf/audio5js.swf',
    codecs: ['mp4', 'vorbis', 'mp3'],
    ready: function(player) {
      var audio_url;
      switch (player.codec) {
        case 'mp4':
          audio_url = '/audio/song.mp4';
          break;
        case 'vorbis':
          audio_url = '/audio/song.ogg';
          break;
        default:
          audio_url = '/audio/song.mp3';
          break;
      }
      this.load(audio_url);
      this.play();
    }
  });

```

## Safari Mobile

Safari mobile won't let you play audio without explicit user interaction. In other words, the initial click on your "play" button
needs to load the audio. Here's an example of how to load and play audio on Safari Mobile with Audio5js:

```html
<button id="play-pause" type="button">Play / Pause</button>
<script>
  var loaded = false;

  var playPause = function () {
    if (!loaded) {
      this.on('canplay', function () {
        loaded = true;
        this.play();
      }, this);
      this.load('/song.mp3');
    } else {
      this.playPause();
    }
  }

  var audio5js = new Audio5js({
    swf_path: './flash/audio5js.swf',
    ready: function () {
      var btn = document.getElementById('play-pause');
      btn.addEventListener('click', playPause.bind(this), false);
    }
  });
</script>
```

## AMD / RequireJS

Audio5js comes baked with AMD / RequireJS support. Assuming your public directory structure is as above, here's an example of
how to use Audio5js with RequireJS:

Your HTML should look something like this:

```html
<script src="js/require.js" data-main="js/player"></script>
```

Inside `js/player.js` you can now require Audio5js like so:

```javascript
require(["js/audio5"], function (Audio5js) {
  var audio5 = new Audio5js({
    ready: function () {
      this.load('/somesong.mp3');
      this.play();
    }
  });
} );
```

## Ender.js

Audio5js can also be used with Ender.js. Here's how you can add it to your project:

```bash
# add audio5 as dependency
$ ender build audio5
```

```javascript
//use as a global package
var Audio5js = require('audio5');
var player = new Audio5js({
  swf_path: 'node_modules/audio5/swf/audio5js.swf'
});

// or via the Ender $ object
var play = new $.audio5({
  swf_path: 'node_modules/audio5/swf/audio5js.swf'
});
```

## Angular.js

Audio5js is available as an Angular.js service.

```html```
<!--include ngAudio5.js after audio5.js-->
<script src="ngAudio5.js"></script>
```

```javascript```
//inject Audio5 service into our app
var app = angular.module('myapp',['Audio5']);

//Inject the AudioService singleton into our controller
var PlayCtrl = function ($scope, AudioService) {
	//bind AudioService to scope
	$scope.player = AudioService;
	//Load the song, every event, class method and Instance attribute from audio5js are accessible from the template
	$scope.player.load('http://danosongs.com/music/danosongs.com-orb-of-envisage.mp3');

	//example of event binding
	$scope.player.on('progress',function(){
		$scope.$apply();
	})
}
```

## Browser Support

Audio5js doesn't try to please everyone. Having said that, it has been successfully tested on:

* IE8, IE9
* Chrome 23 (Mac)
* Firefox 17 (Mac)
* Safari 6
* Opera 12 (Mac)
* Safari Mobile (iOS 6.0)
* Webkit Mobile (Android 4.0.4)

## TODO

* Test on mobile browsers (Android).

## Contributing

* Thanks to [Alex Wolkov](https://github.com/altryne) for AngularJS Demo
* Thanks to [Yehonatan Daniv](https://github.com/ydaniv) for AMD/RequireJS support

Please feel free to fork, fix and send me pull requests. Alternatively, open tickets for bugs and feature requests.

## Credits

Audio5js relies heavily on the wonderful [audiojs library](http://kolber.github.com/audiojs/). The AS3 code for the fallback MP3
player is taken almost as-is from audiojs, with some minor modifications for more comprehensive event handling.

## License

Audio5js is released under the MIT License.

Copyright (c) 2013 Zohar Arad <zohar@zohararad.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Disclaimer

No fluffy penguins were harmed during the making of Audio5js.