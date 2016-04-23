if(!navigator.getUserMedia){
	navigator.getUserMedia = (navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia);
}


var context = new AudioContext();

function hasGetUserMedia() {
  return !!(navigator.getUserMedia);
}

if (hasGetUserMedia()) {
  var errorCallback = function(e) {
    console.log('Reeeejected!', e);
  };

  // Not showing vendor prefixes.
  navigator.getUserMedia({audio: true}, function(localMediaStream) {
    // var player = document.querySelector('audio');
    // player.src = window.URL.createObjectURL(localMediaStream);

    // // Note: onloadedmetadata doesn't fire in Chrome when using it with getUserMedia.
    // // See crbug.com/110938.
    // player.onloadedmetadata = function(e) {
    //   // Ready to go. Do some stuff.
    // };


	var microphone = context.createMediaStreamSource(localMediaStream);
	var filter = context.createBiquadFilter();

	// microphone -> filter -> destination.
	microphone.connect(filter);
	filter.connect(context.destination);
  }, errorCallback);
} else {
  alert('getUserMedia() is not supported in your browser');
}