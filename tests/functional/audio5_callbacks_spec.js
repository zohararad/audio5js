describe('Audio5 Callbacks', function(){
  "use strict";

  var audio5;

  it('should reach canPlay event', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;
        this.on('canplay', function () {
          that.pause();
          that.destroy();
          done();
        });
        this.load('./assets/sample.mp3');
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
          done();
          that.pause();
          that.destroy();
        });
        this.load('./assets/sample.mp3');
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
          that.destroy();
          done();
        });
        this.load('./assets/sample.mp3');
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
            that.pause();
            that.destroy();
            done();
          }, 500);
        });
        this.load('./assets/sample.mp3');
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
          that.destroy();
          done();
        });
        this.load('./assets/sample.mp3');
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
          that.pause();
          that.destroy();
          done();
        });
        this.load('./assets/sample.mp3');
        this.play();
      }
    });
  });

  it('should be able to remove triggers from an event trigger', function(done){

      var timeUpdateFuncCalled = 0;

      var timeupdateFunc = function(position, duration) {
          timeUpdateFuncCalled++;
          if(timeUpdateFuncCalled === 1) {
              // on time update listener, we might wish to remove a listener.
              this.off('timeupdate', timeupdateFunc);
          } else {
              // force tests to fail
              expect(timeUpdateFuncCalled).to.be.equal(1);
          }
      };

      audio5 = new Audio5js({
          swf_path: '../swf/audio5js.swf',
          codecs: ['mp3'],
          ready: function () {
              var that = this;
              this.on('timeupdate', timeupdateFunc, this);
              this.load('./assets/sample.mp3');
              this.play();

              setTimeout(function() {
                  that.pause();
                  that.destroy();
                  expect(timeUpdateFuncCalled).to.be.equal(1);
                  done();
              }.bind(this), 2500);
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
          that.destroy();
          done();
        });
        this.one('canplay', function () {
          that.seek(3);
          that.play();
        });
        this.load('./assets/sample.mp3');
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
          that.seek(3);
          that.play();
        });
        this.load('./assets/sample.mp3');
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
          that.pause();
          that.seek(4);
        });
        this.load('./assets/sample.mp3');
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
          that.pause();
          that.seek(4);
        });
        this.load('./assets/sample.mp3');
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
          that.destroy();
          done();
        });
        this.load('./assets/sample.mp3');
      }
    });
  });

});