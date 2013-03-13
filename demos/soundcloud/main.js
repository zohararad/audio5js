(function () {
  var container = document.querySelector('ul'),
      CLIENT_ID = '?client_id=YOUR_CLIENT_ID>';

  var audio5js = new Audio5js({
    swf_path:'../../swf/audio5js.swf',
    ready: function () {
      var player = this;

      SC.initialize({
        client_id: "YOUR_CLIENT_ID"
      });

      // get last 10 tracks from SoundCloud and show them
      SC.get("/tracks", { limit: 10 }, function (tracks) {
        var html = "";
        tracks.forEach(function (track) {
          html += [
            '<li class=track data-stream=', track.stream_url, CLIENT_ID,
              '<b>', track.title, '</b>',
            '</li>'
          ].join('');
        });
        container.innerHTML = html;
      });

      container.addEventListener('click', function (e) {
        var track = e.target.parentNode;
        if (track.className.indexOf('track') !== -1) {
          player.pause();
          player.load(track.getAttribute('data-stream'));
          player.play();
        }
      });
    }
  });

}());
