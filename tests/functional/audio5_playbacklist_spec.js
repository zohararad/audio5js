describe('Audio5 Playback With List', function(){
  "use strict";

  var audio5;

  it('should toggle playPause', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        var countEvents = 0;
        this.on('canplay', function () {
          countEvents += 100;
          that.playPause();
        });

        this.on('play', function(){
          setTimeout(function(){
            countEvents += 1;
            that.playPause();
          }, 1000);
        });

        this.on('pause', function(){
          if(!that.playing && countEvents > 0){
            if (that.current() < 1) {
              that.next();
            } else {
              expect(countEvents).to.be.equal(201);
              done();
              that.destroy();
            }
          }
        });
        this.load(['./assets/sample.mp3','./assets/sample2.mp3']);
      }
    });
  });
  it('should have a duration', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      format_time: false,
      ready: function () {
        var that = this;

        this.on('timeupdate', function () {
          that.pause();
          var d = Math.round(that.duration);
          if (that.current() === 1) {
            expect(d).to.be.equal(15);
            done();
            that.destroy();
          }
          if (that.current() === 0) {
            expect(d).to.be.equal(4);
            that.next();
          }
        });

        this.load(['./assets/sample.mp3', './assets/sample2.mp3']);
        this.play();
      }
    });
  });

  it('should be seekable', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('canplay', function () {
          that.play();
          setTimeout(function(){
            that.pause();
            expect(that.audio.seekable).to.be.equal(true);
            that.next();

            setTimeout(function() {
                that.pause();
                expect(that.audio.seekable).to.be.equal(true);
                done();
                that.destroy();
            }, 2000)
          }, 2000);
        });

        this.load(['./assets/sample.mp3', './assets/sample2.mp3']);
      }
    });
  });

  it('should seek to a position', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('canplay', function () {
          that.pause();
          if (that.current() === 1) {
            that.seek(15);
            expect(that.position).to.be.equal(15);
            done();
            that.destroy();
          }
          if (that.current() === 0) {
            that.seek(4);
            expect(that.position).to.be.equal(4);
            that.next();
          }
        });

        this.load(['./assets/sample.mp3', './assets/sample2.mp3']);
      }
    });
  });

  it('should change volume', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('play', function () {
          setTimeout(function(){
            that.pause();
            that.volume(0);
            expect(that.volume()).to.be.equal(0);
            that.volume(1);
            expect(that.volume()).to.be.equal(1);
            if (that.current() === 1) {
              done();
              that.destroy();
            } else {
              that.next();
            }
          }, 1000);
        });

        this.load(['./assets/sample.mp3', './assets/sample2.mp3']);
        this.play();
      }
    });
  });

});