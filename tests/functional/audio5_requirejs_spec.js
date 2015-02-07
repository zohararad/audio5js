require(['../../src/audio5'], function(Audio5js){
  "use strict";
  var audio5, player;
  describe("CommonJS", function(){

    it('should not include global Audio5js object', function(){
      expect(window.Audio5js).to.be.undefined;
    });

    it('should be able to create a new instance', function(done){
      audio5 = new Audio5js({
        swf_path: '../swf/audio5js.swf',
        codecs: ['mp4', 'mp3'],
        ready: function (o) {
          player = o;
          this.should.be.an('object');
          done();
          this.destroy();
        }
      });
    });

    it('should use the specified codec', function(){
      if (Audio5js.can_play('mp4')){
        player.codec.should.eql('mp4');
      } else { //fallback is mp3
        player.codec.should.eql('mp3');
      }
    });

  });

  mocha.run();
});