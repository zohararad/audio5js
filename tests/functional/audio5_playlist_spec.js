describe('Audio5 Playlist Object', function(){
  "use strict";

  var playlist, player;

  it('should include global Audio5js object with the Playlist', function(){
    window.Playlist5js.should.be.a('function');
  });

  it('should be able to create a new instance', function(done){
    playlist = new Playlist5js({
      urls: ['./assets/sample.mp3', './assets/sample2.mp3'],
      options: {
        swf_path: '../swf/audio5js.swf',
        codecs: ['mp4', 'mp3']
      }
    });

    console.log(playlist.settings);

    expect(playlist.settings).to.be.deep.equal({
        autonext: false,
        urls: ['./assets/sample.mp3', './assets/sample2.mp3'],
        options: {
          swf_path: '../swf/audio5js.swf',
          codecs: ['mp4', 'mp3']
        },
        events: {}
    });
    done();
  });

  it('should get the next audio objects', function(done){
    playlist = new Playlist5js({
      urls: ['./assets/sample.mp3', './assets/sample2.mp3'],
      options: {
        swf_path: '../swf/audio5js.swf',
        codecs: ['mp4', 'mp3']
      }
    });

    var audio = playlist.next();
    expect(audio).to.be.deep.equal(playlist.currentAudio);

    var audio2 = playlist.next();
    expect(audio2).to.be.deep.equal(playlist.currentAudio);

    var audio3 = playlist.next();
    expect(audio3).to.be.equal(undefined);

    done();
  });

});
