# Audio5js - HTML5 Audio Javascript Library with Flash Fallback

Audio5js a library-agnostic, cross-browser Javascript API for HTML5 Audio, with
a Flash fallback for either older browsers or modern browsers without MP3 playback support.

Unlike existing libraries, Audio5js doesn't attempt to provided a full-fledged audio player, UI and all, nor does it
assume any existing DOM manipulation libraries like jQuery or Zepto.

Instead, Audio5js simply provides a unified API to control audio in the browser using Javascript. Think of it as
an HTML5 Audio playback compatibility layer, where the visual implementation is left to the developer.

## Getting Started

Audio5js requires two components to work - the Javascript library found in `src/audio5js.js` and the SWF fallback, found in `flash/audio5js.swf`.

Simply download the source code, extract, and place both files somewhere in your project. For the purpose of demonstration,
let's assume your project directory structure looks like this:

```
/
-/public
--/js
--- audio5js.js
--/swf
--- audio5js.swf
```

Now, you can include the Javascript in your HTML, and instantiate the Audio player:

```html
<script src="/js/audio5js.js"></script>
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

## Configuration

The Audio5js object accepts a configuration object with the following settings:

* **swf_path** - The relative path to the MP3 Flash fallback SWF. Defaults to `/swf/audio5js.swf`.
* **use_flash** - A boolean flag indicating whether the underlying audio player should use Flash or HTML5. Defaults to `true` in browsers that do not support MP3 playback or `false` otherwise.
* **throw_errors** - A boolean flag indicating whether the player throws errors, or triggers an error event. Defaults to `true`.
* **format_time** - A boolean flag indicating whether playback position and duration should be formatted to a time-string (hh:mm:ss), or remain as unformatted numbers (measured in seconds). Defaults to `true`.
* **ready** - An optional function that will be called when the player is ready to load and play audio.

Here's an example configuartion using all the settings options above:

```
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