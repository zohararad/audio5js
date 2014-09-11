package {

	import flash.display.Sprite;
	import flash.errors.IOError;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.media.ID3Info;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	import flash.net.URLRequest;
	import flash.system.Security;
	import flash.utils.Timer;
	
	public class audio5js extends Sprite {

		private var _channel:SoundChannel;
		private var sound:Sound;
		private var duration:Number;
		private var seekable:Boolean;
		private var playerInstance:String;

		private var pausePoint:Number = 0;
		private var playing:Boolean = false;
		private var volume:Number = 1;
		private var timer:Timer = new Timer(250, 0);


		private function get channel():SoundChannel {
			return this._channel;
		}

		private function set channel(channel:SoundChannel):void {
			this._channel = channel;
			this._channel.addEventListener(Event.SOUND_COMPLETE, this.soundEnded);
		}

		public function audio5js():void {
			Security.allowDomain("*");
			Security.allowInsecureDomain("*");

			// Wait until first frame to alert JS it's ready.
			addEventListener(Event.ENTER_FRAME, ready);
		}
		
		public function ready(event:Event):void
		{
			removeEventListener(Event.ENTER_FRAME, ready);

			this.playerInstance = root.loaderInfo.parameters.playerInstance+'.';

			ExternalInterface.addCallback('load', load);
			ExternalInterface.addCallback('playPause', playPause);
			ExternalInterface.addCallback('pplay', play);
			ExternalInterface.addCallback('ppause', pause);
			ExternalInterface.addCallback('seekTo', seekTo);
			ExternalInterface.addCallback('setVolume', setVolume);
			
			ExternalInterface.call(this.playerInstance+'eiReady');
		}

		private function load(mp3:String):void {
			if (this.channel) this.channel.stop();
			if (this.sound) {
				this.sound.removeEventListener(Event.OPEN, this.loadStart);
				this.sound.removeEventListener(IOErrorEvent.IO_ERROR, this.loadError);
				this.sound.removeEventListener(ProgressEvent.PROGRESS, this.loadProgress);
				this.sound.removeEventListener(Event.ID3, this.ID3Loaded);
				this.timer.removeEventListener(TimerEvent.TIMER, this.timeUpdate);
				this.sound.removeEventListener(ProgressEvent.PROGRESS, this.canPlay);
			}
			
			this.seekable = false;
			this.channel = new SoundChannel();
			this.sound = new Sound(new URLRequest(mp3));
			this.pausePoint = 0;
			
			this.sound.addEventListener(Event.OPEN, this.loadStart);
			this.sound.addEventListener(IOErrorEvent.IO_ERROR, this.loadError);
			this.sound.addEventListener(ProgressEvent.PROGRESS, this.loadProgress);
			this.sound.addEventListener(Event.ID3, this.ID3Loaded);
			this.timer.addEventListener(TimerEvent.TIMER, this.timeUpdate);
			this.sound.addEventListener(ProgressEvent.PROGRESS, this.canPlay);
		}
		
		private function play():void {
			this.channel = this.sound.play(this.pausePoint);
			this.setVolume(this.volume);
			this.playing = true;
			this.timer.start();
			ExternalInterface.call(this.playerInstance+'eiPlay');
		}

		private function pause():void {
			this.pausePoint = this.channel.position;
			this.channel.stop();
			this.playing = false;
			this.timer.stop();
			ExternalInterface.call(this.playerInstance+'eiPause');
		}

		private function playPause():void {
			if (this.playing) {
				this.pause();
			} else {
				this.play();
			}
		}

		private function seekTo(position:Number):void {
			ExternalInterface.call(this.playerInstance+'eiSeeking');
			this.channel.stop();
			this.pausePoint = position * 1000;
			ExternalInterface.call(this.playerInstance+'eiSeeked');
			if (this.playing) {
				this.channel = this.sound.play(this.pausePoint);
				this.setVolume(this.volume);
			} else {
				this.timeUpdate();
			}
		}

		private function setVolume(vol:Number):void {
			this.volume = vol;
			var transform:SoundTransform = this.channel.soundTransform;
			if (vol < 0) vol = 0;
			if (vol > 1) vol = 1;
			transform.volume = vol;
			channel.soundTransform = transform;
			ExternalInterface.call(this.playerInstance+'eiVolumeChange');
		}

		private function loadStart(e:Event):void {
			ExternalInterface.call(this.playerInstance+'eiLoadStart');
		}
		
		private function loadError(e:IOErrorEvent):void {
			var msg:String = e.text;
			ExternalInterface.call(this.playerInstance+'eiLoadError', msg);
		}

		private function loadProgress(e:ProgressEvent):void {
			this.duration = (e.bytesTotal / (e.bytesLoaded / this.sound.length));
			var loadPercent:Number = e.bytesLoaded / e.bytesTotal;
			this.seekable = e.bytesTotal > 0 && this.sound.length > 0;
			
			if (loadPercent > 1) loadPercent = 1;
			if (!this.seekable) loadPercent = 0;
			if (loadPercent >= 0 && this.seekable) {
				ExternalInterface.call(this.playerInstance+'eiProgress', loadPercent * 100, this.duration / 1000, this.seekable);
			}
		}

		private function ID3Loaded(e:Event):void{
			ExternalInterface.call(this.playerInstance+'eiLoadedMetadata');
		}

		private function timeUpdate(e:TimerEvent = null):void {
			var targetPosition:Number = e ? this.channel.position : this.pausePoint;
			ExternalInterface.call(this.playerInstance+'eiTimeUpdate', targetPosition / 1000, this.duration / 1000, this.seekable);
		}

		private function canPlay(e:Event):void {
			this.sound.removeEventListener(ProgressEvent.PROGRESS, this.canPlay);
			ExternalInterface.call(this.playerInstance+'eiCanPlay');
		}

		private function soundEnded(e:Event):void {
			ExternalInterface.call(this.playerInstance+'eiEnded');
		}

	}

}