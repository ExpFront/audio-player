// navigator.getUserMedia = (navigator.getUserMedia ||
// 													navigator.mozGetUserMedia ||
// 													navigator.msGetUserMedia ||
// 													navigator.webkitGetUserMedia);
//
// if (navigator.getUserMedia) {
// 	console.log('getUserMedia supported.');
//
// 	var record = document.getElementsByClassName('button_type_start')[0];
// 	var play = document.getElementsByClassName('button_type_play')[0];
// 	var stop = document.getElementsByClassName('button_type_stop')[0];
//
// 	var constraints = { audio: true };
// 	var chunks = [];
//
// 	var onSuccess = function(stream) {
// 		var mediaRecorder = new MediaRecorder(stream);
//
// 		visualize(stream);
//
// 		record.onclick = function() {
// 			mediaRecorder.start();
// 			console.log(mediaRecorder.state);
// 			console.log("recorder started");
// 			record.style.background = "red";
// 			record.style.color = "black";
// 		}
//
// 		stop.onclick = function() {
// 			mediaRecorder.stop();
// 			console.log(mediaRecorder.state);
// 			console.log("recorder stopped");
// 			record.style.background = "";
// 			record.style.color = "";
// 			// mediaRecorder.requestData();
// 		}
//
// 		mediaRecorder.onstop = function(e) {
// 			console.log("data available after MediaRecorder.stop() called.");
//
// 			var clipName = prompt('Enter a name for your sound clip');
//
// 			var clipContainer = document.createElement('article');
// 			var clipLabel = document.createElement('p');
// 			var audio = document.createElement('audio');
// 			var deleteButton = document.createElement('button');
//
// 			clipContainer.classList.add('clip');
// 			audio.setAttribute('controls', '');
// 			deleteButton.innerHTML = "Delete";
// 			clipLabel.innerHTML = clipName;
//
// 			clipContainer.appendChild(audio);
// 			clipContainer.appendChild(clipLabel);
// 			clipContainer.appendChild(deleteButton);
// 			soundClips.appendChild(clipContainer);
//
// 			audio.controls = true;
// 			var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
// 			chunks = [];
// 			var audioURL = window.URL.createObjectURL(blob);
// 			audio.src = audioURL;
// 			console.log("recorder stopped");
//
// 			deleteButton.onclick = function(e) {
// 				evtTgt = e.target;
// 				evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
// 			}
// 		}
//
// 		mediaRecorder.ondataavailable = function(e) {
// 			chunks.push(e.data);
// 		}
// 	}
//
// 	var onError = function(err) {
// 		console.log('The following error occured: ' + err);
// 	}
//
// 	navigator.getUserMedia(constraints, onSuccess, onError);
// } else {
// 	console.log('getUserMedia not supported on your browser!');
// }





// function __log(e, data) {
// 	 log.innerHTML += "\n" + e + " " + (data || '');
//  }
//  var audio_context;
//  var recorder;
//  function startUserMedia(stream) {
// 	 var input = audio_context.createMediaStreamSource(stream);
// 	 __log('Media stream created.');
// 	 input.connect(audio_context.destination);
// 	 __log('Input connected to audio context destination.');
//
// 	 recorder = new Recorder(input);
// 	 __log('Recorder initialised.');
//  }
//  function startRecording(button) {
// 	 recorder && recorder.record();
// 	 button.disabled = true;
// 	 button.nextElementSibling.disabled = false;
// 	 __log('Recording...');
//  }
//  function stopRecording(button) {
// 	 recorder && recorder.stop();
// 	 button.disabled = true;
// 	 button.previousElementSibling.disabled = false;
// 	 __log('Stopped recording.');
//
// 	 // create WAV download link using audio data blob
// 	 createDownloadLink();
//
// 	 recorder.clear();
//  }
//  function createDownloadLink() {
// 	 recorder && recorder.exportWAV(function(blob) {
// 		 var url = URL.createObjectURL(blob);
// 		 var li = document.createElement('li');
// 		 var au = document.createElement('audio');
// 		 var hf = document.createElement('a');
//
// 		 au.controls = true;
// 		 au.src = url;
// 		 hf.href = url;
// 		 hf.download = new Date().toISOString() + '.wav';
// 		 hf.innerHTML = hf.download;
// 		 li.appendChild(au);
// 		 li.appendChild(hf);
// 		 recordingslist.appendChild(li);
// 	 });
//  }
//  window.onload = function init() {
// 	 try {
// 		 // webkit shim
// 		 window.AudioContext = window.AudioContext || window.webkitAudioContext;
// 		 navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
// 		 window.URL = window.URL || window.webkitURL;
//
// 		 audio_context = new AudioContext;
// 		 __log('Audio context set up.');
// 		 __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
// 	 } catch (e) {
// 		 alert('No web audio support in this browser!');
// 	 }
//
// 	 navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
// 		 __log('No live audio input: ' + e);
// 	 });
//  };

var context = new window.AudioContext();

var onFailSoHard = function(e) {
	console.log('Reeeejected!', e);
};

function hasGetUserMedia() {
	// Note: Opera builds are unprefixed.
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
						navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

if (hasGetUserMedia()) {
	navigator.webkitGetUserMedia({audio: true}, function (stream) {
			var input = me.context.createMediaStreamSource(stream);
			console.log('APi');
			me.recorder = new Recorder(input);
	}, onFailSoHard);
} else {
	alert('getUserMedia() is not supported in your browser');
}
// CROSS BROWSING
// var video = document.querySelector('video');
//
// if (navigator.getUserMedia) {
//   navigator.getUserMedia({audio: true, video: true}, function(stream) {
//     video.src = stream;
//   }, onFailSoHard);
// } else if (navigator.webkitGetUserMedia) {
//   navigator.webkitGetUserMedia('audio, video', function(stream) {
//     video.src = window.webkitURL.createObjectURL(stream);
//   }, onFailSoHard);
// } else {
//   video.src = 'somevideo.webm'; // fallback.
// }
