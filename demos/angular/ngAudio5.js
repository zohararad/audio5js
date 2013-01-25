angular.module('Audio5', []).
	factory('AudioService', function () {
		var params = {
			swf_path:'../../swf/audio5js.swf',
			throw_errors:true,
			format_time:true,
			ready:function () {

			}
		}
		var audio5js = new Audio5js(params);

		return audio5js;
	})
