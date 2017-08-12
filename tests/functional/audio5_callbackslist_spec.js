describe('Audio5 Callbacks With List', function(){
  "use strict";

  var audio5;

  it('should reach canPlay event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('canplay', function () {
          if (that.current() === 0) {
            that.pause();
            that.next();
          } else {
            that.destroy();
            done();
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });

  it('should trigger loadstart event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('loadstart', function () {
          if (that.current() === 0) {
            that.pause();
            that.next();
          } else {
            done();
            that.pause();
            that.destroy();
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });

  it('should start downloading audio', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('progress', function (pos, dur) {
          if (that.current() === 0) {
            that.next();
            that.pause();
          } else {
            that.destroy();
            done();
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
        this.play();
        this.pause();
      }
    });
  });

  it('should trigger play event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('play', function () {
          setTimeout(function(){
            if (that.current() === 0) {
              that.pause();
              that.next();
            } else {
              that.pause();
              that.destroy();
              done();
            }
          }, 500);
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
        this.play();
      }
    });
  });

  it('should trigger pause event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('play', function () {
          setTimeout(function(){
            that.pause();
          }, 500);
        });

        this.on('pause', function () {
          if (that.current() === 0) {
            that.next();
          } else {
            that.destroy();
            done();
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
        that.play();
      }
    });
  });

  it('should trigger timeupdate event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('timeupdate', function () {
          if (that.current() === 0) {
            that.pause();
            that.next();
          } else {
            that.pause();
            that.destroy();
            done();
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
        this.play();
      }
    });
  });

  it('should trigger ended event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('ended', function () {
          if (that.current() === 1) {
            that.destroy();
            done();
          }
        });
        this.on('play', function () {
          setTimeout(function () {
            expect(that.audio.seekable).to.be.equal(true);
            if (that.current() === 0) {
                that.seek(4);
            } else {
                that.seek(14);
            }
          }, 1000);
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
        this.play();
      }
    });
  });

  it('should trigger an event once', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.one('play', function () {
          that.pause();
        });
        this.on('pause', function () {
          that.play();
        });
        this.on('ended', function () {
          that.destroy();
          done();
        });

        this.one('canplay', function () {
          that.play(1);
          that.seek(13);
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });

  it('should trigger seeking event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('seeking', function () {
          that.destroy();
          done();
        });
        this.on('canplay', function () {
          that.next(false);
          that.pause();
          that.seek(14);
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });

  it('should trigger seeked event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('seeked', function () {
          that.destroy();
          done();
        });
        this.on('canplay', function () {
          that.next(false);
          that.pause();
          that.seek(4);
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });

  it('should load metadata', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('loadedmetadata', function () {
          if (that.current() === 1) {
            that.destroy();
            done();
          } else {
            that.next();
            that.pause();
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });

});