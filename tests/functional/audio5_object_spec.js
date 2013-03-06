describe('Audio5 Object', function(){
  "use strict";

  it('should include global Audio5js object', function(){
    should.exist(Audio5js);
  });

  it('should be able to create a new instance', function(){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function (player) {}
    });
    audio5.should.be.an('object');
  });

  it('should reach ready callback', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function (player) {
        should.exist(player);
        player.should.be.an('object');
        done();
      }
    });
  });

  it('should use the specified codec', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp4', 'mp3'],
      ready: function (player) {
        if (Audio5js.can_play('mp4')){
          player.codec.should.eql('mp4');
        } else { //fallback is mp3
          player.codec.should.eql('mp3');
        }
        done();
      }
    });
  });

  it('should format duration as a string', function(done){
    var audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp3'],
      ready: function () {
        var that = this;

        this.on('timeupdate', function () {
          that.pause();
          that.duration.should.eql('00:04');
          done();
        });

        this.load('./assets/sample.mp3');
        this.play();
      }
    });
  });

});