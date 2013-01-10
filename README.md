# Audio5js - The HTML5 Audio Compatibility Layer

Audio5js a library-agnostic, cross-browser Javascript API for HTML5 Audio, with
a Flash fallback for either older browsers or modern browsers without MP3 playback support.

Unlike existing libraries, Audio5js doesn't attempt to provided a full-fledged audio player, UI and all, nor does it
assume any existing DOM manipulation libraries like jQuery or Zepto.

Instead, Audio5js simply provides a unified API to control audio in the browser using Javascript. Think of it as
an HTML5 Audio playback compatibility layer, where the visual implementation is left to the developer.

## Getting Started

Audio5js requires two components to work - the Javascript library found in `src/audio5.js` and the SWF fallback, found in `flash/audio5js.swf`.

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
* **use_flash** - A boolean flag indicating whether the underlying audio player should use Flash or HTML5. Defaults to `true` in browsers that do not support MP3 playback or `false` otherwise.
* **throw_errors** - A boolean flag indicating whether the player throws errors, or triggers an error event. Defaults to `true`.
* **format_time** - A boolean flag indicating whether playback position and duration should be formatted to a time-string (hh:mm:ss), or remain as unformatted numbers (measured in seconds). Defaults to `true`.
* **ready** - An optional function that will be called when the player is ready to load and play audio.

Here's an example configuration using all the settings options above:

```html
<script>

  var initAudio = function () {
    var audio5js = new Audio5js({
      swf_path: '/statics/swf/audio5js.swf',
      use_flash: true,
      throw_errors: true,
      format_time: true,
      ready: function () {
        //this points to the audio5js instance
        this.load('/audio/song.mp3');
        this.play();
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
* **ogg** - check for `audio/ogg; codecs="vorbis"`. Example - `Audio5js.can_play('ogg')`
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
    var use_flash = !Audio5js.can_play('mp3');
    var audio5js = new Audio5js({
      swf_path: '/statics/swf/audio5js.swf',
      use_flash: use_flash,
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
  this.on('timeupdate', function (duration, position) {
    console.log(duration, position);
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
a wider crowd. Instead of complicating the internals of Audio5js to support selective, coded-based instantiation, Audio5js treats you as a grown-up,
and leaves some of the "hard" work to you.

Here's an example of initializing Audio5js with multiple audio sources, based on browser support:

```javascript

  var audio5js, audio_url;
  var settings = {
    swf_path: '/swf/audio5js.swf',
    ready: function (){
      this.load(audio_url);
      this.play();
    }
  };

  if (Audio5js.can_play('mp4')) { //for browsers that support mp4
    audio_url = '/audio/song.mp4';
    settings.use_flash = false;
  } else if (Audio5js.can_play('ogg')) { //for browsers that support ogg
    audio_url = '/audio/song.ogg';
    settings.use_flash = false;
  } else { //fallback to mp3
    audio_url = '/audio/song.mp3';
    settings.use_flash = !Audio5js.can_play('mp3');
  }

  audio5js = new Audio5js(settings);

```

## Browser Support

Audio5js doesn't try to please everyone. Having said that, it has been successfully tested on:

* IE8, IE9
* Chrome
* Firefox
* Safari
* Opera

## TODO

* Test on mobile browsers.
* Add `canPlay` event indicating audio can be played after loading.

## Contributing

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

No fluffy pinguins were harmed during the making of Audio5js.