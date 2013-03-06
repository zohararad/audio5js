describe('Audio5 Callbacks', function(){
  "use strict";

  it('should reach canPlay event', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        this.on('canplay', function () {
          done();
        });
        this.load('./assets/sample.mp3');
      }
    });
  });

  it('should start downloading audio', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        this.on('progress', function (pos, dur) {
          done();
        });
        this.load('./assets/sample.mp3');
        this.play();
        this.pause();
      }
    });
  });

  it('should trigger play event', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('play', function () {
          that.pause();
          done();
        });
        this.load('./assets/sample.mp3');
        this.play();
      }
    });
  });

  it('should trigger pause event', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('pause', function () {
          done();
        });
        this.load('./assets/sample.mp3');
        this.play();
        that.pause();
      }
    });
  });

  it('should trigger timeupdate event', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('timeupdate', function () {
          that.pause();
          done();
        });
        this.load('./assets/sample.mp3');
        this.play();
      }
    });
  });

  it('should trigger ended event', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('ended', function () {
          done();
        });
        this.on('canplay', function () {
          that.seek(4);
          that.volume(0);
          that.play();
        });
        this.load('./assets/sample.mp3');
      }
    });
  });
});