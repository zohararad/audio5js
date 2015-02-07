describe('Audio5 Object', function(){
  "use strict";

  var audio5, player;

  it('should include global Audio5js object', function(){
    window.Audio5js.should.be.a('function');
  });

  it('should be able to create a new instance', function(done){
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp4', 'mp3'],
      ready: function (o) {
        player = o;
        expect(this).to.be.an('object');
        this.destroy();
        done();
      }
    });
  });

  it('should use the specified codec', function(){
    if (Audio5js.can_play('mp4')){
      expect(player.codec).to.be.equal('mp4');
    } else { //fallback is mp3
      expect(player.codec).to.be.equal('mp3');
    }
  });

  it('should destroy audio', function(done) {
    audio5 = new Audio5js({
      swf_path: '../swf/audio5js.swf',
      codecs: ['mp4', 'mp3'],
      ready: function (o) {
        var that = this;
        this.on('canplay', function () {
          that.destroy();
          expect(that.audio.audio).to.be.undefined;
          done();
        });
        this.load('./assets/sample.mp3');
      }
    });
  });

});