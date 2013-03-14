describe('Audio5 Playback', function(){
  "use strict";

  it('should toggle playPause', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('canplay', function () {
          that.playPause();
        });

        this.on('play', function(){
          that.playPause();
        });

        this.on('pause', function(){
          if(!that.playing){
            done();
          }
        });
        this.load('./assets/sample.mp3');
      }
    });
  });

  it('should have a duration', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      format_time: false,
      ready: function () {
        var that = this;

        this.on('timeupdate', function () {
          that.pause();
          var d = Math.round(that.duration);
          d.should.eql(4);
          done();
        });

        this.load('./assets/sample.mp3');
        this.play();
      }
    });
  });

  it('should be seekable', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('canplay', function () {
          that.pause();
          that.seekable.should.eql(true);
          done();
        });

        this.load('./assets/sample.mp3');
      }
    });
  });

  it('should seek to a position', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('canplay', function () {
          that.pause();
          that.seek(4);
          that.position.should.eql(4);
          done();
        });

        this.load('./assets/sample.mp3');
      }
    });
  });

  it('should change volume', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('play', function () {
          that.pause();
          that.volume(0);
          that.volume().should.eql(0);
          done();
        });

        this.load('./assets/sample.mp3');
        this.play();
      }
    });
  });

});